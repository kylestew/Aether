import { createPlayer } from './src/player.js'
import { Layer } from './src/layerManager.js'

import { imageLayer } from './layers/media/imageLayer.js'
import { simple3DLayer } from './layers/generators/simple3DLayer.js'

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

const imagePath = '/assets/images/pearl.png'
// const imagePath = '/assets/images/lenna.png'
// const imagePath = '/assets/images/david.png'

const layers = [
    // new Layer(modeSize, imageLayer, {
    //     imagePath,
    //     cropMode: 'cover',
    // }),
    new Layer(modeSize, simple3DLayer),

    // new Layer(modeSize, model3DLoader),

    // new Layer(modeSize, pixelPattern, {
    //     // pattern: pixelPattern._defaultBayer4x4,
    //     // color: '#ffffff',
    //     // scale: 4,
    // }),

    // new Layer(fullSize, nullLayer),

    // new Layer(modeSize, blur, {
    //     radius: 10,
    //     color: '#ffffff',
    //     size: 50,
    // }),
    // new Layer(modeSize, staticNoise, {
    //     density: 0.5,
    //     color: '#ffffff',
    //     alpha: 1.0,
    //     blendMode: 'overlay', // Noise will overlay the image
    // }),
    // new Layer(modeSize, threshold, {
    //     threshold: (t) => 0.5 + Math.sin(t) * 0.2, // Animate threshold between 0.1 and 0.9
    //     blendMode: 'normal', // Threshold will multiply with the result
    // }),
]

const projectSettings = {
    size: fullSize,
    animated: true,
    duration: 10, // seconds
    targetFPS: 30, // cap rendering at 30 fps
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
