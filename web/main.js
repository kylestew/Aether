import init, { Renderer } from './pkg/aether_wasm.js'

let wasmModule
let renderer
let canvas
let ctx
let imgData

// Helper function to convert image element to RGBA bytes
function imageToRgbaBytes(imgEl) {
    const offscreen = document.createElement('canvas')
    offscreen.width = imgEl.width
    offscreen.height = imgEl.height
    const offCtx = offscreen.getContext('2d')
    offCtx.drawImage(imgEl, 0, 0)
    const data = offCtx.getImageData(0, 0, offscreen.width, offscreen.height)
    return data.data // Uint8ClampedArray
}

// Helper function to convert RGBA bytes to base64
function rgbaBytesToBase64(bytes) {
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
}

// Build a composition JSON from current layers (example implementation)
function buildExampleComp(width, height) {
    return {
        width,
        height,
        background: [20, 20, 30, 255], // Dark background
        layers: [
            {
                id: 0,
                name: 'Background Gradient',
                enabled: true,
                opacity: 1.0,
                blend: 'Normal',
                transform: { m00: 1, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0 },
                kind: {
                    Gradient: {
                        c0: [255, 100, 100, 255], // Red
                        c1: [100, 100, 255, 255], // Blue
                        angle_deg: 45.0,
                    },
                },
            },
        ],
    }
}

// Load an image layer example
async function addImageLayer(compData, imagePath) {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
            const rgbaBytes = imageToRgbaBytes(img)
            const imageLayer = {
                id: compData.layers.length,
                name: 'Image Layer',
                enabled: true,
                opacity: 0.8,
                blend: 'Normal',
                transform: {
                    m00: 0.5,
                    m01: 0,
                    m02: compData.width * 0.25,
                    m10: 0,
                    m11: 0.5,
                    m12: compData.height * 0.25,
                },
                kind: {
                    Image: {
                        width: img.width,
                        height: img.height,
                        pixels: Array.from(rgbaBytes), // Convert to regular array for JSON
                    },
                },
            }
            compData.layers.push(imageLayer)
            resolve()
        }
        img.src = imagePath
    })
}

// Initialize the WASM module and renderer
async function initWasm(canvasId, width = 800, height = 600) {
    // Initialize WASM
    wasmModule = await init()

    // Get canvas and setup context
    canvas = document.getElementById(canvasId)
    if (!canvas) {
        throw new Error(`Canvas with id '${canvasId}' not found`)
    }

    canvas.width = width
    canvas.height = height
    ctx = canvas.getContext('2d')
    imgData = ctx.createImageData(width, height)

    // Create renderer
    renderer = new Renderer(width, height)

    console.log('WASM Aether renderer initialized')
    return renderer
}

// Load a composition into the renderer
async function loadComp(compData) {
    if (!renderer) {
        throw new Error('Renderer not initialized')
    }

    const compJson = JSON.stringify(compData)
    renderer.load_comp(compJson)
    console.log('Composition loaded')
}

// Render a frame
function renderFrame(timeMs = 0) {
    if (!renderer) {
        throw new Error('Renderer not initialized')
    }

    // Call Rust render
    const ptr = renderer.render(timeMs)
    const len = renderer.frame_len()

    // Copy pixels from WASM memory
    const pixels = new Uint8ClampedArray(wasmModule.memory.buffer, ptr, len)
    imgData.data.set(pixels)

    // Draw to canvas
    ctx.putImageData(imgData, 0, 0)
}

// Animation loop
let animationId
let startTime

function startAnimation() {
    startTime = performance.now()

    function loop(currentTime) {
        const elapsed = currentTime - startTime
        renderFrame(elapsed)
        animationId = requestAnimationFrame(loop)
    }

    animationId = requestAnimationFrame(loop)
}

function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = null
    }
}

// Example usage and testing
async function runExample() {
    try {
        // Initialize with a canvas
        await initWasm('output', 800, 600)

        // Build example composition
        const compData = buildExampleComp(800, 600)

        // Add an image layer (you can uncomment this if you have an image)
        // await addImageLayer(compData, '/assets/images/david.png');

        // Load the composition
        await loadComp(compData)

        // Render single frame
        renderFrame()

        // Start animation
        startAnimation()

        console.log('Example running successfully!')
    } catch (error) {
        console.error('Error running example:', error)
    }
}

// Export functions for use
export { initWasm, loadComp, renderFrame, startAnimation, stopAnimation, runExample, buildExampleComp, addImageLayer }
