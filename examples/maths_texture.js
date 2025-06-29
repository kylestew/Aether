import { createPlayer } from '../src/player.js'
import { Layer } from '../src/layer.js'

import { image } from '../layers/media/image.js'

import { pixelPattern } from '../layers/generators/pixelPattern.js'
import { perlinNoise } from '../layers/generators/perlinNoise.js'
import { snowNoise } from '../layers/generators/snowNoise.js'

import { threshold } from '../layers/pixel/threshold.js'
import { adjustments } from '../layers/pixel/adjustments.js'
import { blur } from '../layers/pixel/blur.js'
import { vignette } from '../layers/pixel/vignette.js'

// MODES: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
// MODE 6 is closest to CGA mode 0 (320x200(CGA) - 320x180 (ours))
const mode = 40
const fullSize = [1080, 1080]
// const fullSize = [1080, 1920]
const modeSize = [fullSize[0] / mode, fullSize[1] / mode]

const imagePath = '/assets/images/pearl.png'
// const imagePath = '/assets/images/lenna.png'
// const imagePath = '/assets/images/david.png'
// const imagePath = '/assets/images/premium_photo-1736749650508-fcf0c377868b.avif'

const color1 = '#ff7f7e'
const color2 = '#80757f'
const color3 = '#37350d'

const layers = [
    new Layer({ size: modeSize }, image, {
        imagePath,
        cropMode: 'cover',
    }),

    new Layer({ size: modeSize }, vignette, { strength: 0.9, softness: 0.2, radius: 0.5 }),

    // new Layer({ size: modeSize, blendMode: 'overlay', opacity: 0.1 }, snowNoise),
    //
    new Layer({ size: modeSize, blendMode: 'overlay' }, perlinNoise, { colorize: true, color1, color2: color3 }),

    // new Layer({ size: modeSize }, adjustments, {
    //     brightness: -0.2,
    //     contrast: 0.0,
    //     saturation: 0.0,
    //     hue: 0.0,
    // }),
]

const player = createPlayer({
    size: fullSize,
    animated: true,
    duration: 15, // seconds
    targetFPS: 15,
    antialias: false,
    layers,
})
await player.loadAndStart()
