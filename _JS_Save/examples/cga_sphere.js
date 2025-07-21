import { createPlayer } from '../src/player.js'
import { Layer } from '../src/layer.js'

import { fragShader } from '../layers/generators/fragShader.js'
import { cgaDither } from '../layers/postproc/cgaDither.js'

import fragSource from '/assets/shaders/cga_sphere.glsl?raw'

// 135 x 240 mode
// MODES AVAILABLE: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
// MODE 6 is closest to CGA mode 0 (320x200(CGA) - 320x180 (ours))
const mode = 8
const fullSize = [1080, 1920]
const modeSize = [fullSize[0] / mode, fullSize[1] / mode]

const layers = [new Layer({ size: modeSize }, fragShader, { fragSource }), new Layer({ size: modeSize }, cgaDither)]

const player = createPlayer({
    size: fullSize,
    animated: true,
    duration: 10, // seconds
    targetFPS: 30, // cap rendering at 30 fps
    layers,
})
await player.loadAndStart()
