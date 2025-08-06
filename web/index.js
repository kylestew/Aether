// Import the WASM package
import { main, WasmAether } from './pkg/index.js'

// Call main to initialize the WASM module
main()

const canvas = document.getElementById('canvas')
if (!canvas) {
    throw new Error('Canvas element not found')
}
const ctx = canvas.getContext('2d')
if (!ctx) {
    throw new Error('Could not get 2D context from canvas')
}
const width = canvas.width
const height = canvas.height

// Create a basic Aether configuration as a plain JS object
const basicConfig = {
    layers: [
        {
            blend: 'normal',
            opacity: 1.0,
            renderer: {
                type: 'Solid',
                rgb: 'FF00AA',
            },
        },
        {
            blend: 'multiply',
            opacity: 0.5,
            renderer: { type: 'Noise', seed: 123 },
        },
    ],
}

let aether = new WasmAether(basicConfig, width, height)

console.log('WASM Aether engine loaded and initialized successfully!')

// FPS tracking
let frameCount = 0
let fpsTimer = performance.now()
let currentFPS = 0
const fpsElement = document.getElementById('fps')

function draw2D(aether, ctx) {
    const w = aether.width,
        h = aether.height

    const bytes = aether.frame() // Uint8Array view into WASM memory (no copy)
    const clamped = new Uint8ClampedArray(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    const img = new ImageData(clamped, width, height)
    ctx.putImageData(img, 0, 0)

    // FPS calculation
    frameCount++
    const now = performance.now()
    const elapsed = now - fpsTimer

    if (elapsed >= 1000) {
        // Update every second
        currentFPS = (frameCount * 1000) / elapsed
        frameCount = 0
        fpsTimer = now
        fpsElement.textContent = `FPS: ${currentFPS.toFixed(1)}`
    }
}

function animate() {
    const time = performance.now() / 1000.0 // Convert to seconds
    aether.render(time)
    draw2D(aether, ctx)
    requestAnimationFrame(animate)
}

// Start the animation loop
animate()
