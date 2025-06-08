import { createPlayer } from './src/player.js'
import { Layer } from './src/layerManager.js'
import { pulse, osc, saw } from './src/paramMacros.js'

import { emptyLayer } from './layers/emptyLayer.js'
import { gradientLayer } from './layers/generators/gradientLayer.js'
import { imageLayer } from './layers/media/imageLayer.js'
import { scanLines } from './layers/generators/scanLines.js'
import { pulsingSquares } from './layers/generators/pulsingSquares.js'
import { pixelateLayer } from './layers/postproc/pixelateLayer.js'
import { bayerDither } from './layers/postproc/bayerDither.js'
import { receiptEffect } from './layers/postproc/receiptEffect.js'
import { dottedHalftoneEffect } from './layers/postproc/dottedHalftoneEffect.js'
import { asciiDitherLayer } from './layers/postproc/asciiDitherLayer.js'
import { simple3DLayer } from './layers/generators/simple3DLayer.js'
import { shaderLayer } from './layers/generators/shaderLayer.js'
import { paletteQuantization } from './layers/postproc/paletteQuantization.js'
import { uniformQuantization } from './layers/postproc/uniformQuantization.js'
import { cgaDither } from './layers/postproc/cgaDither.js'
import { noiseLayer } from './layers/generators/noiseLayer.js'
import { nullLayer } from './layers/generators/nullLayer.js'

import fragSource from '/assets/shaders/cga_sphere.glsl?raw'

// 135 x 240 mode
// MODES AVAILABLE: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
// MODE 6 is closest to CGA mode 0 (320x200(CGA) - 320x180 (ours))
const mode = 4
const size = [1080, 1920]
const modeSize = [size[0] / mode, size[1] / mode]

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
const imagePath = '/assets/images/david.png'

const layers = [
    // new Layer(modeSize, emptyLayer, { color: 'red' }),

    // new Layer(modeSize, gradientLayer, {
    //     startColor: '#ffffff',
    //     endColor: '#000000',
    //     direction: 'vertical',
    // }),

    // TODO: animate noise layer
    // new Layer(modeSize, noiseLayer, {
    //     // scale: pulse(0.2, 0.03, 0.08), // Pulse the scale for zoom effect
    //     scale: 0.05,
    //     octaves: 4, // Fewer octaves for clearer patterns
    //     persistence: 0.5, // Standard persistence
    //     lacunarity: 1.0, // Standard lacunarity
    //     timeScale: 0.1, // Slightly faster animation
    //     colorize: true, // Keep color
    //     color1: '#000000', // Start with black
    //     color2: '#ffffff', // End with white
    //     // Use animation functions for movement
    //     // offsetX: saw(0.2), // Smooth horizontal pan
    //     // offsetY: osc(0.1, Math.PI / 2), // Subtle vertical oscillation
    //     offsetZ: (t) => Math.sin(t * 0.5) * 12.0, // Sine wave animation in z-space
    // }),

    new Layer(modeSize, imageLayer, { imagePath, cropMode: 'cover' }),

    // new Layer(modeSize, shaderLayer, { fragSource }),

    // new Layer(modeSize, cgaDither),

    // new Layer(pulsingSquares),
    // new Layer(modeSize, scanLines),
    // new Layer(simple3DLayer),

    // new Layer(pixelateLayer, { pixelSize: 4 }),

    new Layer(modeSize, receiptEffect),
    // new Layer(dottedHalftoneEffect),
    // new Layer(asciiDitherLayer, { cellSize: 12 }),
    // new Layer(bayerDither),

    // new Layer(paletteQuantization, { palette: palette0HighRGB }),
    // new Layer(uniformQuantization, { numBins: 8 }),

    // new Layer(size, scanLines, {
    //     lineCount: 20, // Override default
    //     color: '#E0F234',
    //     amplitude: (t) => 60 + Math.sin(t) * 10, // Custom animated value
    // }),

    new Layer(size, nullLayer),
]

// const layer2 = new Layer(width, height, pulsingSquares, {
//     // size: (t) => 20 + Math.sin(t) * 10, // pulse between 20–80px
//     // color: (t) => step(0.5, ['#ff0080', '#00ffff', '#ffffff']),
//     // rotation: (t) => osc(0.2), // subtle wiggle
// })
// const keyframed = new Layer(width, height, keyframeCircleLayer, {
//     // Can override keyframes here if needed
// })

const projectSettings = {
    size,
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
