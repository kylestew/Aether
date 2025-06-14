import { createPlayer } from './src/player.js'
import { Layer } from './src/layerManager.js'

// generators
import { gradient } from './layers/generators/gradient.js'
import { particles, SimpleEmitter, ScatterOnceEmitter } from './layers/generators/particles.js'
import { pixelPattern, horizontalDither } from './layers/generators/pixelPattern.js'
import { popcornNoise } from './layers/generators/popcornNoise.js'
import { simple3DLayer } from './layers/generators/simple3DLayer.js'

// pixel
import { blur } from './layers/pixel/blur.js'
import { pixelate } from './layers/pixel/pixelate.js'
import { posterize } from './layers/pixel/posterize.js'
import { threshold } from './layers/pixel/threshold.js'

// postproc
import { receipt } from './layers/postproc/receipt.js'
import { waves } from './layers/postproc/waves.js'
import { shapeDither } from './layers/postproc/shapeDither.js'

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

// animations
// rotation
const spin = (pct) => [0, pct * Math.PI * 2, 0]

const tumble = (pct) => {
    const angle = pct * Math.PI * 2
    return [angle, angle * 0.5, angle * 0.2]
}

const wobble = (pct) => {
    const a = Math.sin(pct * Math.PI * 2)
    return [a * 0.3, a * 0.2, Math.cos(pct * Math.PI * 2) * 0.3]
}

// position
const hover = (pct) => [0, Math.sin(pct * Math.PI * 2 * 2) * 0.4, 0]

const orbit = (pct) => {
    const angle = pct * Math.PI * 2
    return [Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5]
}

const bobAndWeave = (pct) => {
    const a = pct * Math.PI * 2
    return [Math.sin(a) * 0.5, Math.sin(a * 2) * 0.3, 0]
}

// scale
const pulse = (pct) => 1 + Math.sin(pct * Math.PI * 2) * 0.2
const squashStretch = (pct) => Math.sin(pct * Math.PI * 2) * 0.1
const growShrink = (pct) => Math.abs(Math.sin(pct * Math.PI))

const layers = [
    // Classic hover and spin
    new Layer({ size: modeSize }, simple3DLayer, {
        geometryType: 'icosahedron',
        rotation: spin,
        // position: hover,
    }),

    // Tumble and pulse
    // new Layer({ size: modeSize }, simple3DLayer, {
    //     geometryType: 'cube',
    //     // rotation: tumble,
    //     scale: pulse,
    // }),

    // // Orbiting dodecahedron
    // new Layer({ size: modeSize }, simple3DLayer, {
    //     geometryType: 'dodecahedron',
    //     position: orbit,
    //     rotation: spin,
    // }),

    // Grow-shrink only (great for transitions)
    // new Layer({ size: modeSize }, simple3DLayer, {
    //     geometryType: 'octahedron',
    //     scale: growShrink,
    // }),

    // new Layer({ size: modeSize, blendMode: 'normal' }, gradient, {
    //     startColor: '#efefef',
    //     endColor: '#efefef',
    // }),

    // new Layer({ size: modeSize, blendMode: 'overlay', opacity: 0.5 }, pixelPattern, {
    //     scale: 1,
    //     // pattern: horizontalDither,
    // }),
    // new Layer({ size: modeSize, blendMode: 'normal', opacity: 1.0 }, popcornNoise),

    // new Layer({ size: modeSize }, blur, { radius: 1 }),
    // new Layer({ size: modeSize }, pixelate, {}),
    // new Layer({ size: modeSize }, posterize, { numBins: 4 }),
    // new Layer({ size: modeSize }, threshold, { threshold: 0.5 }),

    // new Layer({ size: modeSize }, receipt, {}),
    // new Layer({ size: modeSize }, waves, {}),
    // new Layer({ size: modeSize }, shapeDither, {}),
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
