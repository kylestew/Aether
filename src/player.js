// projectSettings:
// - width
// - height
// - duration
// - targetFPS
// - layers
export const createPlayer = (elements, settings) => {
    const { canvas, timeLabel, playPauseBtn, exportBtn } = elements
    const { size, animated, duration, targetFPS, layers } = settings
    const [width, height] = size

    // Video export settings
    const exportFormats = [
        {
            name: 'Individual Frames (PNG)',
            mimeType: 'frames',
            extension: 'png',
            quality: 'lossless',
        },
        {
            name: 'WebM VP9 (Lossless)',
            mimeType: 'video/webm;codecs=vp9',
            extension: 'webm',
            bitrate: 100000000,
            quality: 'lossless',
            videoBitsPerSecond: 100000000,
            audioBitsPerSecond: 0,
            keyFrameInterval: 1,
        },
        {
            name: 'WebM VP8 (High Quality)',
            mimeType: 'video/webm;codecs=vp8',
            extension: 'webm',
            bitrate: 100000000,
            quality: 'high',
        },
    ]

    // Find supported formats
    const supportedFormats = exportFormats.filter(
        (format) => format.mimeType === 'frames' || MediaRecorder.isTypeSupported(format.mimeType)
    )

    // Log supported formats for debugging
    console.log(
        'Supported formats:',
        supportedFormats.map((f) => f.name)
    )

    // Default to frames if available, otherwise VP9, then first supported format
    let currentFormat =
        supportedFormats.find((f) => f.mimeType === 'frames') ||
        supportedFormats.find((f) => f.mimeType === 'video/webm;codecs=vp9') ||
        supportedFormats[0]

    // Create composite canvas for blending
    const compositeCanvas = document.createElement('canvas')
    compositeCanvas.width = width
    compositeCanvas.height = height
    const compositeCtx = compositeCanvas.getContext('2d')
    compositeCtx.imageSmoothingEnabled = false

    // prepare canvas and context
    canvas.width = width
    canvas.height = height
    canvas.style.imageRendering = 'pixelated'
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false // Disable smoothing for crisp pixel art

    // Playback State
    let isPlaying = false
    let startTime = null
    let lastRenderTime = null
    let frameCount = 0
    let mediaRecorder = null
    let recordedChunks = []
    let isExporting = false

    const render = (t) => {
        // Clear both canvases
        ctx.clearRect(0, 0, width, height)
        compositeCtx.clearRect(0, 0, width, height)

        // Calculate current frame
        const frame = Math.floor(t * targetFPS)

        // Render each layer
        for (const layer of layers) {
            // Render the layer to its own canvas
            layer.render(t, compositeCtx, {
                width,
                height,
                totalTime: duration,
                frame,
                targetFPS,
                t, // normalized time (0 to duration)
            })

            // Apply the layer with its blend mode to the composite
            layer.applyBlendMode(compositeCtx)
        }

        // Draw final composite to main canvas
        ctx.drawImage(compositeCanvas, 0, 0)
    }

    const start = () => {
        if (isPlaying) return
        isPlaying = true
        startTime = performance.now() - (lastRenderTime || 0)
        requestAnimationFrame(animate)
    }

    const stop = () => {
        isPlaying = false
        lastRenderTime = performance.now() - startTime
    }

    const animate = (now) => {
        if (!isPlaying) return

        const elapsed = (now - startTime) / 1000 // Convert to seconds
        const t = elapsed % duration
        const frame = Math.floor(t * targetFPS)

        // Update time label with both time and frame
        timeLabel.textContent = `${t.toFixed(2)}s - frame ${frame}`

        // Render frame
        render(t)

        // Continue animation
        requestAnimationFrame(animate)
    }

    function resizeCanvas() {
        const container = canvas.parentElement
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight

        const scale = Math.min(containerWidth / width, containerHeight / height)

        canvas.style.width = width * scale + 'px'
        canvas.style.height = height * scale + 'px'
    }
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('DOMContentLoaded', resizeCanvas)

    playPauseBtn.addEventListener('click', () => {
        if (!isPlaying) {
            start()
        } else {
            isPlaying = false
            // pauseOffset = parseFloat(slider.value)
            playPauseBtn.textContent = '▶️'
        }
    })

    async function exportFrames() {
        if (isExporting) return
        isExporting = true
        exportBtn.textContent = '⏳'

        try {
            // Load JSZip if not already loaded
            if (!window.JSZip) {
                const script = document.createElement('script')
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
                document.head.appendChild(script)
                await new Promise((resolve, reject) => {
                    script.onload = resolve
                    script.onerror = reject
                })
            }

            // Pause current playback
            const wasPlaying = isPlaying
            if (wasPlaying) {
                isPlaying = false
                playPauseBtn.textContent = '▶️'
            }

            console.log('Starting frame export')
            console.log('Canvas size:', canvas.width, 'x', canvas.height)
            console.log('Target FPS:', targetFPS)
            console.log('Duration:', duration)

            let frameCount = 0
            const totalFrames = Math.ceil(duration * targetFPS)
            const zip = new JSZip()

            // Override the render function to capture frames
            const originalRender = render
            render = async function (t) {
                // Call original render
                originalRender(t)

                // Capture frame
                const frameData = canvas.toDataURL('image/png')
                const frameNumber = frame.toString().padStart(5, '0')
                const frameName = `frame_${frameNumber}.png`

                // Convert base64 to binary
                const base64Data = frameData.split(',')[1]
                const binaryData = atob(base64Data)
                const array = new Uint8Array(binaryData.length)
                for (let i = 0; i < binaryData.length; i++) {
                    array[i] = binaryData.charCodeAt(i)
                }

                // Add to zip
                zip.file(frameName, array)

                frameCount++
                console.log(`Captured frame ${frameCount}/${totalFrames}: ${frameName}`)

                // Update button text with progress
                exportBtn.textContent = `⏳ ${Math.round((frameCount / totalFrames) * 100)}%`
            }

            // Use requestAnimationFrame to ensure smooth playback
            const startExportTime = performance.now()
            const exportDuration = duration * 1000

            function exportFrame(timestamp) {
                if (!isExporting) return

                const elapsed = timestamp - startExportTime
                if (elapsed >= exportDuration) {
                    console.log('Export duration reached, creating zip...')
                    // Create and download zip
                    zip.generateAsync({ type: 'blob' }).then(function (content) {
                        const url = URL.createObjectURL(content)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `aether-frames-${new Date().toISOString().slice(0, 19)}.zip`
                        a.click()
                        URL.revokeObjectURL(url)

                        isExporting = false
                        exportBtn.textContent = '📹'

                        // Restore original render
                        render = originalRender

                        // Resume playback if it was playing
                        if (wasPlaying) {
                            start()
                        }
                    })
                    return
                }

                // Calculate current time and frame
                const t = elapsed / 1000
                const frame = Math.floor(t * targetFPS)

                // Render frame
                render(t)

                // Continue animation
                requestAnimationFrame(exportFrame)
            }

            // Start the export animation
            requestAnimationFrame(exportFrame)
        } catch (e) {
            console.error('Export error:', e)
            isExporting = false
            exportBtn.textContent = '❌'
            setTimeout(() => {
                exportBtn.textContent = '📹'
            }, 2000)
            // Restore original render if it was overridden
            if (render !== originalRender) {
                render = originalRender
            }
        }
    }

    async function exportVideo() {
        // If frames format is selected, use frame export
        if (currentFormat.mimeType === 'frames') {
            return exportFrames()
        }

        if (isExporting) return
        isExporting = true
        exportBtn.textContent = '⏳'

        try {
            // Pause current playback
            const wasPlaying = isPlaying
            if (wasPlaying) {
                isPlaying = false
                playPauseBtn.textContent = '▶️'
            }

            console.log('Starting export with format:', currentFormat.name)
            console.log('Canvas size:', canvas.width, 'x', canvas.height)
            console.log('Target FPS:', targetFPS)
            console.log('Duration:', duration)

            // Set up MediaRecorder with maximum quality settings
            const stream = canvas.captureStream(targetFPS)
            if (!stream) {
                throw new Error('Failed to capture canvas stream')
            }

            // Create a high-quality MediaRecorder with custom settings
            const options = {
                mimeType: currentFormat.mimeType,
                videoBitsPerSecond: currentFormat.bitrate,
                audioBitsPerSecond: 0, // No audio
            }

            console.log('MediaRecorder options:', options)

            // Verify format is supported
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                throw new Error(`Format ${options.mimeType} is not supported`)
            }

            mediaRecorder = new MediaRecorder(stream, options)
            if (!mediaRecorder) {
                throw new Error('Failed to create MediaRecorder')
            }

            let frameCount = 0
            let lastFrameTime = 0
            recordedChunks = []

            // Override the render function to ensure frames are captured
            const originalRender = render
            render = function (t) {
                // Call original render
                originalRender(t)

                // Log frame info
                const now = performance.now()
                const frameTime = now - lastFrameTime
                lastFrameTime = now
                frameCount++

                console.log(`Frame ${frameCount}: t=${t.toFixed(3)}, time=${frameTime.toFixed(1)}ms`)
            }

            mediaRecorder.ondataavailable = (e) => {
                console.log('Data available:', e.data.size, 'bytes', 'at frame', frameCount)
                if (e.data.size > 0) {
                    recordedChunks.push(e.data)
                }
            }

            mediaRecorder.onerror = (e) => {
                console.error('MediaRecorder error:', e)
                isExporting = false
                exportBtn.textContent = '❌'
                setTimeout(() => {
                    exportBtn.textContent = '📹'
                }, 2000)
                // Restore original render
                render = originalRender
            }

            mediaRecorder.onstop = () => {
                console.log('Recording stopped, frames:', frameCount, 'chunks:', recordedChunks.length)
                // Restore original render
                render = originalRender

                if (recordedChunks.length === 0) {
                    console.error('No data recorded')
                    isExporting = false
                    exportBtn.textContent = '❌'
                    setTimeout(() => {
                        exportBtn.textContent = '📹'
                    }, 2000)
                    return
                }

                try {
                    const blob = new Blob(recordedChunks, {
                        type: currentFormat.mimeType,
                        endings: 'native',
                    })
                    console.log('Created blob:', blob.size, 'bytes')

                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `aether-export-lossless-${new Date().toISOString().slice(0, 19)}.${
                        currentFormat.extension
                    }`
                    a.click()
                    URL.revokeObjectURL(url)

                    isExporting = false
                    exportBtn.textContent = '📹'

                    // Resume playback if it was playing
                    if (wasPlaying) {
                        start()
                    }
                } catch (e) {
                    console.error('Error creating/saving blob:', e)
                    isExporting = false
                    exportBtn.textContent = '❌'
                    setTimeout(() => {
                        exportBtn.textContent = '📹'
                    }, 2000)
                }
            }

            // Start recording with maximum quality
            console.log('Starting recording...')
            mediaRecorder.start(1000 / targetFPS) // Request data at frame rate intervals

            // Play through the animation
            startTime = null
            lastRenderTime = null
            isPlaying = true

            // Use requestAnimationFrame to ensure smooth playback
            const startExportTime = performance.now()
            const exportDuration = duration * 1000

            function exportFrame(timestamp) {
                if (!isExporting) return

                const elapsed = timestamp - startExportTime
                if (elapsed >= exportDuration) {
                    console.log('Export duration reached, stopping...')
                    mediaRecorder.stop()
                    isPlaying = false
                    return
                }

                // Calculate current time and frame
                const t = elapsed / 1000
                const frame = Math.floor(t * targetFPS)

                // Render frame
                render(t)

                // Continue animation
                requestAnimationFrame(exportFrame)
            }

            // Start the export animation
            requestAnimationFrame(exportFrame)
        } catch (e) {
            console.error('Export error:', e)
            isExporting = false
            exportBtn.textContent = '❌'
            setTimeout(() => {
                exportBtn.textContent = '📹'
            }, 2000)
            // Restore original render if it was overridden
            if (render !== originalRender) {
                render = originalRender
            }
        }
    }

    // Add format selection UI to emphasize VP9
    const formatSelect = document.createElement('select')
    formatSelect.style.marginLeft = '10px'
    formatSelect.style.background = '#333'
    formatSelect.style.color = 'white'
    formatSelect.style.border = '1px solid #555'
    formatSelect.style.padding = '2px 5px'
    formatSelect.style.borderRadius = '3px'
    formatSelect.style.fontWeight = 'bold'

    // Sort formats to put VP9 first
    const sortedFormats = [...supportedFormats].sort((a, b) => {
        if (a.mimeType.includes('vp9')) return -1
        if (b.mimeType.includes('vp9')) return 1
        return 0
    })

    // Log available formats
    console.log(
        'Available formats:',
        sortedFormats.map((f) => ({
            name: f.name,
            mimeType: f.mimeType,
            supported: MediaRecorder.isTypeSupported(f.mimeType),
        }))
    )

    sortedFormats.forEach((format) => {
        const option = document.createElement('option')
        option.value = format.mimeType
        option.textContent = `${format.name} (${format.extension.toUpperCase()})`
        formatSelect.appendChild(option)
    })

    formatSelect.addEventListener('change', (e) => {
        const newFormat = supportedFormats.find((f) => f.mimeType === e.target.value)
        if (newFormat) {
            console.log('Switching to format:', newFormat.name)
            currentFormat = newFormat
        }
    })

    // Insert format select after export button
    exportBtn.parentNode.insertBefore(formatSelect, exportBtn.nextSibling)

    exportBtn.addEventListener('click', exportVideo)

    const loadAndStart = async () => {
        // Initialize all layers
        for (const layer of layers) {
            console.log('Initializing layer:', layer)
            await layer.init()
        }
        console.log('All layers initialized')

        // Start animation if enabled
        if (animated) {
            console.log('Starting animation')
            start()
        } else {
            console.log('Rendering single frame')
            // Render single frame
            render(0)
        }
    }

    return {
        loadAndStart,
        start,
        stop,
        // ... other exports ...
    }
}

/*

// ----------------------
// FPS Tracking
// ----------------------
let lastFrameTime = null
let lastFpsUpdate = 0
let frameCount = 0
let fps = 0

function updateFps(timestamp) {
    if (lastFrameTime !== null) {
        const delta = (timestamp - lastFrameTime) / 1000
        frameCount++
        if (timestamp - lastFpsUpdate > 500) {
            fps = Math.round(frameCount / ((timestamp - lastFpsUpdate) / 1000))
            fpsDisplay.textContent = `FPS: ${fps}`
            frameCount = 0
            lastFpsUpdate = timestamp
        }
    } else {
        lastFpsUpdate = timestamp
    }
    lastFrameTime = timestamp

// ----------------------
// Controls
// ----------------------

slider.addEventListener('input', () => {
    const t = parseFloat(slider.value)
    timeLabel.textContent = `${t.toFixed(2)}s`
    if (!isPlaying) render(t)
})
*/
