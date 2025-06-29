import { createPlayer } from '../src/player.js'
import { Layer } from '../src/layer.js'

import { image } from '../layers/media/image.js'

import { pixelPattern } from '../layers/generators/pixelPattern.js'

import { threshold } from '../layers/pixel/threshold.js'
import { adjustments } from '../layers/pixel/adjustments.js'

// MODES: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
// MODE 6 is closest to CGA mode 0 (320x200(CGA) - 320x180 (ours))
const mode = 6
const fullSize = [1080, 1080]
// const fullSize = [1080, 1920]
const modeSize = [fullSize[0] / mode, fullSize[1] / mode]

const imagePath = '/assets/images/pearl.png'
// const imagePath = '/assets/images/lenna.png'
// const imagePath = '/assets/images/david.png'
// const imagePath = '/assets/images/premium_photo-1736749650508-fcf0c377868b.avif'

const ditherBlendMode = 'multiply'
// const ditherBlendMode = 'normal'
const pattern = 'bayer'
// const pattern = 'clustered_dot'
// const pattern = 'diagonal_dither'
// const pattern = 'spiral_dot_dither'
// const pattern = 'line_dither'
// const pattern = 'crosses'
// const pattern = 'beehive'

const layers = [
    new Layer({ size: modeSize }, image, {
        imagePath,
        cropMode: 'cover',
    }),

    // new Layer({ size: modeSize, blendMode: 'normal' }, pixelPattern, {
    //     pattern: 'test',
    //     scale: 3,
    // }),

    new Layer({ size: modeSize }, adjustments, {
        brightness: 0.0,
        contrast: 0.0,
        saturation: 0.0,
        hue: 0.0,
    }),

    new Layer({ size: modeSize, blendMode: ditherBlendMode }, pixelPattern, {
        pattern,
        scale: 1,
    }),

    new Layer({ size: modeSize }, threshold, {
        threshold: 0.5,
        factor: 0.0,
    }),
]

const player = createPlayer({
    size: fullSize,
    animated: false,
    // duration: 15, // seconds
    // targetFPS: 15,
    antialias: false,
    layers,
})
await player.loadAndStart()
