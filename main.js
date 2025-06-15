import { createPlayer } from './src/player.js'
import { Layer } from './src/layerManager.js'

import { nullLayer } from './layers/nullLayer.js'

// media
import { imageLayer } from './layers/media/imageLayer.js'

// generators
import { gradient } from './layers/generators/gradient.js'
import { particles, SimpleEmitter, ScatterOnceEmitter } from './layers/generators/particles.js'
import { pixelPattern, horizontalDither } from './layers/generators/pixelPattern.js'
import { popcornNoise } from './layers/generators/popcornNoise.js'
import { simple3DLayer } from './layers/generators/simple3DLayer.js'

// pixel
import { blur } from './layers/pixel/blur.js'
import { invert } from './layers/pixel/invert.js'
import { pixelate } from './layers/pixel/pixelate.js'
import { posterize } from './layers/pixel/posterize.js'
import { threshold } from './layers/pixel/threshold.js'

// postproc
import { cgaDither } from './layers/postproc/cgaDither.js'
import { receipt } from './layers/postproc/receipt.js'
import { shapeDither } from './layers/postproc/shapeDither.js'
import { waves } from './layers/postproc/waves.js'

// MODES: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
// MODE 6 is closest to CGA mode 0 (320x200(CGA) - 320x180 (ours))
const mode = 4
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
    // new Layer({ size: modeSize, blendMode: 'normal' }, gradient, {
    //     startColor: '#efefef',
    //     endColor: '#efefef',
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
    //     rotation: (t, pct) => [Math.sin(1.0 * Math.PI * t), 0.0, 0.0],
    // }),

    // new Layer({ size: modeSize }, blur, { radius: 1 }),
    new Layer({ size: modeSize }, invert),
    // new Layer({ size: modeSize }, pixelate, {}),
    // new Layer({ size: modeSize }, posterize, { numBins: 4 }),
    // new Layer({ size: modeSize }, threshold, { threshold: 0.5 }),

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

const projectSettings = {
    size: fullSize,
    animated: true,
    duration: 6, // seconds
    targetFPS: 24,
    antialias: true,
    layers,
}

const player = createPlayer(
    {
        canvas: document.getElementById('output'),
        timeLabel: document.getElementById('timeLabel'),
        playPauseBtn: document.getElementById('playPause'),
        exportBtn: document.getElementById('exportBtn'),
    },
    projectSettings
)
await player.loadAndStart()
