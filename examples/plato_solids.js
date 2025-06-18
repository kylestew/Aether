import { createPlayer } from '../src/player.js'
import { Layer } from '../src/layer.js'
import { hover, spin, tumble, wobble, twistSpin, pulse } from '../src/parametrics.js'
import { applyCurve, linear, easeInOut, punch } from '../src/curves.js'

// generators
import { gradient } from '../layers/generators/gradient.js'
import { pixelPattern, horizontalDither } from '../layers/generators/pixelPattern.js'
import { popcornNoise } from '../layers/generators/popcornNoise.js'
import { simple3DLayer } from '../layers/generators/simple3DLayer.js'

// pixel
import { blur } from '../layers/pixel/blur.js'
import { pixelate } from '../layers/pixel/pixelate.js'
import { posterize } from '../layers/pixel/posterize.js'
import { threshold } from '../layers/pixel/threshold.js'
import { vignette } from '../layers/pixel/vignette.js'

// postproc
import { cgaDither } from '../layers/postproc/cgaDither.js'
import { receipt } from '../layers/postproc/receipt.js'
import { waves } from '../layers/postproc/waves.js'
import { shapeDither } from '../layers/postproc/shapeDither.js'

// MODES: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
// MODE 6 is closest to CGA mode 0 (320x200(CGA) - 320x180 (ours))
const mode = 6
const fullSize = [1080, 1920]
const modeSize = [fullSize[0] / mode, fullSize[1] / mode]

const layers = [
    // === BACKGROUND =================
    // Background color
    new Layer({ size: modeSize }, gradient, {
        startColor: '#000',
        endColor: '#000',
    }),

    // stylized lines
    new Layer(
        { size: modeSize },
        {
            render(ctx, { pct, width, height }) {
                // Draw a series of rotated lines
                const numLines = 32
                const spacing = height / numLines
                const extraLength = width // Add extra length to ensure coverage when rotated

                ctx.strokeStyle = '#fff'
                ctx.lineWidth = 3

                // Save context state
                ctx.save()

                // Translate to center and rotate
                ctx.translate(width / 2, height / 2)
                ctx.rotate((45 * Math.PI) / 180)
                ctx.scale(1.2, 1.2)
                ctx.translate(-width / 2, -height / 2)

                // Offset based on animation percentage
                const offset = spacing * pct * 12

                for (let i = 0; i < numLines; i++) {
                    const y = (i * spacing + offset) % height
                    ctx.beginPath()
                    ctx.moveTo(-extraLength, y)
                    ctx.lineTo(width + extraLength, y)
                    ctx.stroke()
                }

                // Restore context state
                ctx.restore()
            },
        }
    ),

    new Layer({ size: modeSize }, vignette, {
        strength: 1.0,
        radius: 0.33,
        softness: 0.2,
        center: [0.5, 0.5],
        aspectMode: 'circular',
        invert: true,
    }),
    // ================================

    // Classic hover and spin
    new Layer({ size: modeSize }, simple3DLayer, {
        backgroundColor: 'transparent',
        geometryType: 'icosahedron',
        rotation: applyCurve(spin(1), easeInOut),
        position: applyCurve(hover(2, 0.4), easeInOut),
    }),

    // Tumble and pulse
    // new Layer({ size: modeSize }, simple3DLayer, {
    //     geometryType: 'cube',
    //     rotation: twistSpin(),
    //     // scale: pulse(1),
    // }),

    // new Layer({ size: modeSize, blendMode: 'overlay' }, gradient, {
    //     startColor: '#000000',
    //     endColor: '#efefef',
    // }),
    // new Layer({ size: modeSize, blendMode: 'overlay', opacity: 1.0 }, popcornNoise),
    // new Layer({ size: modeSize }, blur, { radius: 1 }),
    // new Layer({ size: modeSize }, posterize, { numBins: 4 }),

    new Layer({ size: modeSize }, cgaDither, {}),

    // new Layer({ size: modeSize }, pixelate, {}),
    // new Layer({ size: modeSize }, threshold, { threshold: 0.5 }),
    // new Layer({ size: modeSize }, receipt, {}),
    // new Layer({ size: modeSize }, waves, {}),
    // new Layer({ size: modeSize }, shapeDither, {}),
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
