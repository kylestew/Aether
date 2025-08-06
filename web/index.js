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

// Create a basic Aether configuration
const basicConfig = JSON.stringify({
    layers: [
        {
            blend: 'screen',
            opacity: 1.0,
            renderer: {
                type: 'Solid',
                rgb: 'FF00FF',
            },
        },
    ],
})

// Create WasmAether instance
console.log('Creating WasmAether with config:', basicConfig)
console.log('Canvas dimensions:', width, 'x', height)

let aether = new WasmAether(basicConfig, width, height)

console.log('WASM Aether engine loaded and initialized successfully!')

function draw2D(aether, ctx2d) {
    const w = aether.width,
        h = aether.height

    const u8 = aether.frame() // Uint8Array view into WASM memory (RGBA8)
    console.log('Frame data length:', u8.length, 'bytes')
    console.log('Expected length:', w * h * 4, 'bytes (RGBA)')
    console.log('First few pixels:', Array.from(u8.slice(0, 16)))

    // ImageData needs Uint8ClampedArray; make a view without copying the bytes
    const clamped = new Uint8ClampedArray(u8.buffer, u8.byteOffset, u8.byteLength)
    const img = new ImageData(clamped, w, h)
    ctx2d.putImageData(img, 0, 0)
    console.log('Frame drawn to canvas')
}

aether.render(0.0)
draw2D(aether, ctx)
