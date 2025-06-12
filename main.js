import { createPlayer } from './src/player.js'
import { Layer } from './src/layerManager.js'

import { nullLayer } from './layers/nullLayer.js'

// media
import { imageLayer } from './layers/media/imageLayer.js'

// generators
import { gradient } from './layers/generators/gradient.js'
import { pixelPattern } from './layers/generators/pixelPattern.js'
import { popcornNoise } from './layers/generators/popcornNoise.js'
import { simple3DLayer } from './layers/generators/simple3DLayer.js'

// pixel
import { blur } from './layers/pixel/blur.js'
import { pixelate } from './layers/pixel/pixelate.js'
import { posterize } from './layers/pixel/posterize.js'
import { threshold } from './layers/pixel/threshold.js'

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

const horizontalDither = [
    [205, 230, 230, 230, 230, 205, 178, 178, 152, 152, 152, 178],
    [64, 32, 32, 32, 32, 64, 96, 126, 126, 126, 96, 96],
    [178, 178, 152, 152, 152, 178, 205, 230, 230, 230, 230, 205],
    [96, 126, 126, 126, 96, 96, 64, 32, 32, 32, 32, 64],
].map((row) => row.map((val) => val / 255))

const layers = [
    new Layer({ size: modeSize }, imageLayer, {
        imagePath,
        cropMode: 'cover',
    }),

    // new Layer({ size: modeSize, blendMode: 'normal' }, gradient),
    // new Layer({ size: modeSize, blendMode: 'overlay', opacity: 0.5 }, pixelPattern, {
    //     scale: 1,
    //     // pattern: horizontalDither,
    // }),
    // new Layer({ size: modeSize, blendMode: 'normal', opacity: 1.0 }, popcornNoise),
    // new Layer({ size: modeSize }, simple3DLayer),

    // new Layer({ size: modeSize }, blur, { radius: 1 }),
    new Layer({ size: modeSize }, pixelate, {}),
    // new Layer({ size: modeSize }, posterize, { numBins: 4 }),
    // new Layer({ size: modeSize }, threshold, { threshold: 0.5 }),

    // new Layer(fullSize, nullLayer),

    // new Layer(modeSize, threshold, {
    //     threshold: (t) => 0.5 + Math.sin(t) * 0.2, // Animate threshold between 0.1 and 0.9
    //     blendMode: 'normal', // Threshold will multiply with the result
    // }),
]

const projectSettings = {
    size: fullSize,
    animated: true,
    duration: 10, // seconds
    targetFPS: 12,
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
