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
    ],
}

let aether = new WasmAether(basicConfig, width, height)

console.log('WASM Aether engine loaded and initialized successfully!')

function draw2D(aether, ctx) {
    const w = aether.width,
        h = aether.height

    const bytes = aether.frame() // Uint8Array view into WASM memory (no copy)
    const clamped = new Uint8ClampedArray(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    const img = new ImageData(clamped, width, height)
    ctx.putImageData(img, 0, 0)

    // const bytes = aether.frame() // Uint8Array view into WASM memory (RGBA8)
    console.log('Frame data length:', bytes.length, 'bytes')
    console.log('Expected length:', w * h * 4, 'bytes (RGBA)')
    console.log('First few pixels:', Array.from(bytes.slice(0, 16)))
}

aether.render(0.0)
draw2D(aether, ctx)
