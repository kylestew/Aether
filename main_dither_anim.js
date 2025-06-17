import { createPlayer } from './src/player.js'
import { Layer } from './src/layer.js'
import { osc } from './src/parametrics.js'

// generators
import { gradient } from './layers/generators/gradient.js'
import { cgaDither } from './layers/postproc/cgaDither.js'
import { feedback } from './layers/postproc/feedback.js'

// MODES: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
// MODE 6 is closest to CGA mode 0 (320x200(CGA) - 320x180 (ours))
const mode = 20
const fullSize = [1080, 1920]
const modeSize = [fullSize[0] / mode, fullSize[1] / mode]

/**
 * Linear interpolation between two colors
 * @param {string} color1 - Starting color in hex format (#RRGGBB)
 * @param {string} color2 - Ending color in hex format (#RRGGBB)
 * @param {number} t - Interpolation value between 0 and 1
 * @returns {string} Interpolated color in hex format
 */
const lerpColor = (color1, color2, t) => {
    const c1 = parseInt(color1.slice(1), 16)
    const c2 = parseInt(color2.slice(1), 16)

    const r1 = (c1 >> 16) & 255,
        g1 = (c1 >> 8) & 255,
        b1 = c1 & 255
    const r2 = (c2 >> 16) & 255,
        g2 = (c2 >> 8) & 255,
        b2 = c2 & 255

    const r = Math.round(r1 + (r2 - r1) * t)
    const g = Math.round(g1 + (g2 - g1) * t)
    const b = Math.round(b1 + (b2 - b1) * t)

    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

const layers = [
    // new Layer({ size: modeSize, blendMode: 'normal' }, gradient, {
    //     startColor: (t) => lerpColor('#ffffff', '#000000', osc(0.1, 0.5, 0.5)(t)),
    //     endColor: (t) => lerpColor('#ffffff', '#000000', osc(0.1, 0.5, 0.5)(t)),
    // }),

    // EXAMPLE: Invoke Canvas commands directly
    new Layer(
        { size: modeSize },
        {
            render(ctx, { pct, width, height }) {
                ctx.clearRect(0, 0, width, height)

                // Lerp from black to white based on animation progress
                const color = lerpColor('#000000', '#ffffff', osc(1.0, 0.5, 0.5)(pct))
                ctx.strokeStyle = color
                ctx.lineWidth = 3

                // Calculate scanner position horizontally based on animation progress
                const minX = width * 0.1 // Start at 10% from left
                const maxX = width * 0.9 // End at 90% from right
                const scannerX = minX + (maxX - minX) * osc(1.0, 0.5, 0.5)(pct)

                ctx.beginPath()
                ctx.arc(scannerX, height / 2, 20, 0, Math.PI * 2)
                ctx.stroke()
            },
        }
    ),

    new Layer({ size: modeSize, blendMode: 'normal' }, cgaDither, {}),

    // TODO: this feedback does not work
    new Layer({ size: modeSize, blendMode: 'source-over' }, feedback, {
        hold: 1.0,
        movement: [0, -1],
    }),
]

const player = createPlayer({
    size: fullSize,
    animated: true,
    duration: 6, // seconds
    targetFPS: 24,
    antialias: false,
    layers,
})
await player.loadAndStart()
