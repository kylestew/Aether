import { createPlayer } from '../src/player.js'
import { Layer } from '../src/layer.js'

// MODES: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
// MODE 6 is closest to CGA mode 0 (320x200(CGA) - 320x180 (ours))
const mode = 1
const fullSize = [1080, 1080]
const modeSize = [fullSize[0] / mode, fullSize[1] / mode]

/// x, y are in range [-1, 1]
/// output in range [0, 1]
function mathsFn(x, y, pct) {
    const time = pct * Math.PI * 3

    // Avoid division by zero
    if (Math.abs(x) < 0.001) x = 0.001
    if (Math.abs(y) < 0.001) y = 0.001

    // Create interesting patterns using tangent function
    const radius = Math.sqrt(x * x + y * y)
    const angle = Math.atan2(y, x)

    // Tangent-based spiral pattern
    const spiral = Math.tan(radius * 4 - time * 2) * Math.cos(angle * 2 + time)

    // Tangent interference pattern
    const interference = Math.tan(x * 6 + time) * Math.tan(y * 4 - time * 1.5)

    // Radial tangent waves
    const radial = Math.tan(radius * 3 + time) * Math.exp(-radius * 1.5)

    // Combine patterns with tangent function
    let result = spiral * 0.4 + interference * 0.3 + radial * 0.3

    // Add some high-frequency tangent detail
    const detail = Math.tan(x * 15 + y * 12 + time * 4) * 0.1
    result += detail

    // Normalize and apply non-linear transformations
    result = (result + 2) * 0.25 // Normalize tangent output
    result = Math.abs(result) // Take absolute value to handle tangent's range
    result = Math.pow(result, 0.7) // Gamma correction

    return Math.max(0, Math.min(1, result))
}

const mathsTexture = new Layer(
    { size: modeSize },
    {
        render(ctx, { pct, width, height }) {
            const imageData = ctx.createImageData(width, height)
            const data = imageData.data

            for (let y = 0; y < height; y++) {
                const yT = (y / height) * 2.0 - 1.0

                for (let x = 0; x < width; x++) {
                    const i = (y * width + x) * 4
                    const xT = (x / width) * 2.0 - 1.0

                    const val = mathsFn(xT, yT, pct)

                    data[i] = val * 255.0
                    data[i + 1] = val * 255.0
                    data[i + 2] = val * 255.0
                    data[i + 3] = 255
                }
            }

            ctx.putImageData(imageData, 0, 0)
        },
    }
)

const layers = [mathsTexture]

const player = createPlayer({
    size: fullSize,
    animated: true,
    duration: 15, // seconds
    targetFPS: 15,
    antialias: false,
    layers,
})
await player.loadAndStart()
