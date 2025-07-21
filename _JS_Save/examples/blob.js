import { createPlayer } from '../src/player.js'
import { Layer } from '../src/layer.js'

import { fragShader } from '../layers/generators/fragShader.js'
import { cgaDither } from '../layers/postproc/cgaDither.js'

import fragSource from '/assets/shaders/blob.glsl?raw'

// 135 x 240 mode
// MODES AVAILABLE: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
// MODE 6 is closest to CGA mode 0 (320x200(CGA) - 320x180 (ours))
const mode = 12
const fullSize = [1080, 1920]
const modeSize = [fullSize[0] / mode, fullSize[1] / mode]

console.log(fragSource)

const layers = [
    // new Layer(emptyLayer, { color: 'red' }),
    // new Layer(gradientLayer, {
    //     startColor: '#ffffff',
    //     endColor: '#000000',
    //     direction: 'vertical',
    // }),

    new Layer({ size: modeSize }, fragShader, { fragSource }),

    // new Layer(imageLayer, { imagePath, cropMode: 'cover' }),

    new Layer({ size: modeSize }, cgaDither),

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

const player = createPlayer({
    size: fullSize,
    animated: true,
    duration: 6, // seconds
    targetFPS: 24,
    antialias: false,
    layers,
})
await player.loadAndStart()
