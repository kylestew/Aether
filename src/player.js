// projectSettings:
// - width
// - height
// - duration
// - targetFPS
// - layers
export function createPlayer(domElements, projectSettings) {
    const { canvas, timeLabel, playPauseBtn } = domElements
    const { width, height, duration, targetFPS, layers } = projectSettings

    const frameInterval = 1000 / targetFPS

    // prepare canvas and context
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    // Playback State
    let isPlaying = false
    let startTime = null
    let lastRenderFrame = -1
    // let pauseOffset = parseFloat(slider.value) // start point when paused

    function render(t, f) {
        let inputCtx = null
        for (let i = 0; i < layers.length; i++) {
            // render function invoked on layerManager wrapper
            layers[i].render({
                t,
                f,
                inputCtx,
                resolution: { width, height },
                layerIndex: i,
                totalTime: duration,
                totalFrames: Math.floor(duration * targetFPS),
            })
            inputCtx = layers[i].getPixels()
        }

        ctx.clearRect(0, 0, width, height)
        for (const layer of layers) {
            // TODO: composite modes?
            ctx.drawImage(layer.canvas, 0, 0)
        }
    }

    function animationLoop(timestamp) {
        if (!isPlaying) return

        if (startTime === null) startTime = timestamp

        // calculate time elapsed since start
        const elapsedMs = timestamp - startTime
        const elapsedSec = elapsedMs / 1000

        // loop animation time
        const t = elapsedSec % duration // loops

        // divide to get current frame number
        const frame = Math.floor(t * targetFPS)

        // if its a new frame, render it
        if (frame > lastRenderFrame) {
            // adjust time to be actual start of frame
            const adjustedTime = frame / targetFPS
            render(adjustedTime, frame)
            lastRenderFrame = frame

            // was this the last frame?
            if (frame >= Math.floor(duration * targetFPS) - 1) {
                lastRenderFrame = -1
            }
        }

        timeLabel.textContent = `${t.toFixed(2)}s - frame ${frame}`

        requestAnimationFrame(animationLoop)
    }

    function start() {
        isPlaying = true
        startTime = null
        lastRenderFrame = -1

        //     pauseOffset = parseFloat(slider.value)
        playPauseBtn.textContent = '⏸'
        requestAnimationFrame(animationLoop)
    }

    playPauseBtn.addEventListener('click', () => {
        if (!isPlaying) {
            start()
        } else {
            isPlaying = false
            // pauseOffset = parseFloat(slider.value)
            playPauseBtn.textContent = '▶️'
        }
    })

    async function loadAndStart() {
        // need to load all layers contents
        await Promise.all(layers.map((layer) => layer.init(width, height)))
        start()
    }

    return { loadAndStart }
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
