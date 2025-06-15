import { createPlayer } from './src/player.js'
import { Layer } from './src/layerManager.js'

import { fragShader } from './layers/generators/fragShader.js'
import { cgaDither } from './layers/postproc/cgaDither.js'

import fragSource from '/assets/shaders/cga_sphere.glsl?raw'

// 135 x 240 mode
// MODES AVAILABLE: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
// MODE 6 is closest to CGA mode 0 (320x200(CGA) - 320x180 (ours))
const mode = 6
const width = 1080 / mode
const height = 1920 / mode

const layers = [
    new Layer({ size: [width, height] }, fragShader, { fragSource }),
    new Layer({ size: [width, height] }, cgaDither),
]

const projectSettings = {
    size: [width, height],
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
