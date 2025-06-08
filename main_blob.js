import { createPlayer } from './src/player.js'
import { Layer } from './src/layerManager.js'

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

import fragSource from '/assets/shaders/blob.glsl?raw'

// 135 x 240 mode
// MODES AVAILABLE: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
// MODE 6 is closest to CGA mode 0 (320x200(CGA) - 320x180 (ours))
const mode = 12
const width = 1080 / mode
const height = 1920 / mode

const imagePath = '/assets/images/pearl.png'
// const imagePath = '/assets/images/david.png'

const layers = [
    new Layer(emptyLayer, { color: 'red' }),
    // new Layer(gradientLayer, {
    //     startColor: '#ffffff',
    //     endColor: '#000000',
    //     direction: 'vertical',
    // }),

    new Layer(shaderLayer, { fragSource }),

    // new Layer(imageLayer, { imagePath, cropMode: 'cover' }),

    new Layer(cgaDither),

    // new Layer(pulsingSquares),
    // new Layer(scanLines),
    // new Layer(simple3DLayer),

    // new Layer(pixelateLayer, { pixelSize: 4 }),

    // new Layer(receiptEffect),
    // new Layer(dottedHalftoneEffect),
    // new Layer(asciiDitherLayer, { cellSize: 12 }),
    // new Layer(bayerDither),

    // new Layer(paletteQuantization, { palette: palette0HighRGB }),
    // new Layer(uniformQuantization, { numBins: 8 }),
]

const projectSettings = {
    width,
    height,
    scale: mode, // pixel size
    duration: 10, // seconds
    targetFPS: 30, // cap rendering at 30 fps
    layers,
}

const player = createPlayer(
    {
        canvas: document.getElementById('output'),
        timeLabel: document.getElementById('timeLabel'),
        playPauseBtn: document.getElementById('playPause'),
    },
    projectSettings
)
await player.loadAndStart()
