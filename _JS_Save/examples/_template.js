import { createPlayer } from './src/player.js'
import { Layer } from './src/layer.js'

import { nullLayer } from './layers/nullLayer.js'

// media
import { imageLayer } from './layers/media/imageLayer.js'

// generators
import { gradient } from './layers/generators/gradient.js'
import { particles, SimpleEmitter, ScatterOnceEmitter } from './layers/generators/particles.js'
import { pixelPattern, horizontalDither } from './layers/generators/pixelPattern.js'
import { popcornNoise } from './layers/generators/popcornNoise.js'
import { simple3DLayer } from './layers/generators/simple3DLayer.js'
import { text } from './layers/generators/text.js'

// pixel
import { blur } from './layers/pixel/blur.js'
import { invert } from './layers/pixel/invert.js'
import { pixelate } from './layers/pixel/pixelate.js'
import { posterize } from './layers/pixel/posterize.js'
import { rgbOffset } from './layers/pixel/rgbOffset.js'
import { threshold } from './layers/pixel/threshold.js'
import { adjustments } from './layers/pixel/adjustments.js'

// postproc
import { cgaDither } from './layers/postproc/cgaDither.js'
import { feedback } from './layers/postproc/feedback.js'
import { receipt } from './layers/postproc/receipt.js'
import { shapeDither } from './layers/postproc/shapeDither.js'
import { waves } from './layers/postproc/waves.js'

// MODES: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
// MODE 6 is closest to CGA mode 0 (320x200(CGA) - 320x180 (ours))
const mode = 1
const fullSize = [1080, 1920]
const modeSize = [fullSize[0] / mode, fullSize[1] / mode]

// CGA Palette 0 - High Intensity
const palette0High = [
    '#000000', // Black
    '#55FFFF', // Bright Cyan
    '#FF55FF', // Bright Magenta
    '#FFFFFF', // White
]
const palette0HighRGB = [
    [0, 0, 0], // Black
    [85, 255, 255], // Bright Cyan
    [255, 85, 255], // Bright Magenta
    [255, 255, 255], // White
]

// const imagePath = '/assets/images/pearl.png'
const imagePath = '/assets/images/lenna.png'
// const imagePath = '/assets/images/david.png'
// const imagePath = '/assets/images/premium_photo-1736749650508-fcf0c377868b.avif'

const layers = [
    new Layer({ size: modeSize }, imageLayer, {
        imagePath,
        cropMode: 'cover',
    }),

    new Layer({ size: modeSize }, rgbOffset, {}),

    // new Layer({ size: modeSize, blendMode: 'normal' }, gradient, {
    //     startColor: '#fff',
    //     endColor: '#000',
    // }),

    // new Layer({ size: modeSize }, particles, {
    //     color: '#000000',
    //     size: 2,

    //     // emitter: new SimpleEmitter({ x: modeSize[0] / 2, y: modeSize[1] / 2 }),
    //     emitter: new ScatterOnceEmitter({ width: modeSize[0], height: modeSize[1], density: 0.02 }),

    //     TODO: add force fields / vector fields

    //     // constructor({ x, y, direction, spread, spawnRate, speed, life } = {}) {
    // }),
    // new Layer({ size: modeSize, blendMode: 'overlay', opacity: 0.5 }, pixelPattern, {
    //     scale: 1,
    //     // pattern: horizontalDither,
    // }),
    // new Layer({ size: modeSize, blendMode: 'normal', opacity: 1.0 }, popcornNoise),

    // new Layer({ size: modeSize }, simple3DLayer, {
    //     geometryType: 'icosahedron',
    //     backgroundColor: 'transparent',
    //     rotation: (t, pct) => [Math.sin(1.0 * Math.PI * t), 0.0, 0.0],
    // }),

    // EXAMPLE: Invoke Canvas commands directly
    // new Layer(
    //     { size: modeSize },
    //     {
    //         render(ctx, { pct, width, height }) {
    //             // Draw a series of rotated lines
    //             const numLines = 1
    //             const spacing = height / numLines
    //             const extraLength = width // Add extra length to ensure coverage when rotated

    //             ctx.strokeStyle = '#fff'
    //             ctx.lineWidth = 2

    //             // Save context state
    //             ctx.save()

    //             // Clear background to black
    //             // ctx.fillStyle = '#000'
    //             // ctx.fillRect(0, 0, width, height)

    //             // Translate to center and rotate
    //             ctx.translate(width / 2, height / 2)
    //             ctx.rotate((45 * Math.PI) / 180)
    //             ctx.scale(1.2, 1.2)
    //             ctx.translate(-width / 2, -height / 2)

    //             // Offset based on animation percentage
    //             const offset = spacing * pct * 1

    //             for (let i = 0; i < numLines; i++) {
    //                 const y = (i * spacing + offset) % height
    //                 ctx.beginPath()
    //                 ctx.moveTo(-extraLength, y)
    //                 ctx.lineTo(width + extraLength, y)
    //                 ctx.stroke()
    //             }

    //             // Restore context state
    //             ctx.restore()
    //         },
    //     }
    // ),

    // new Layer({ size: modeSize }, adjustments, {
    //     brightness: 0.2, // Slightly brighter
    //     contrast: 0.5, // Slightly more contrast
    //     saturation: -0.6, // Slightly less saturated
    // }),

    // new Layer({ size: modeSize }, text, {}),

    // new Layer({ size: modeSize }, blur, { radius: 1 }),
    // new Layer({ size: modeSize }, invert),
    // new Layer({ size: modeSize }, pixelate, {}),
    // new Layer({ size: modeSize }, posterize, { numBins: 4 }),
    // new Layer({ size: modeSize }, threshold, { threshold: 0.5 }),

    // needs to be set to replace all contents
    // new Layer({ size: modeSize, blendMode: 'source-over' }, feedback, {}),

    // new Layer({ size: modeSize }, cgaDither, {}),

    // new Layer({ size: modeSize }, receipt, {}),
    // new Layer({ size: modeSize }, waves, {}),
    // new Layer({ size: modeSize }, shapeDither, {}),

    // new Layer(fullSize, nullLayer),

    // new Layer(modeSize, threshold, {
    //     threshold: (t) => 0.5 + Math.sin(t) * 0.2, // Animate threshold between 0.1 and 0.9
    //     blendMode: 'normal', // Threshold will multiply with the result
    // }),
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
