import { createPlayer } from './src/player.js'
import { Layer } from './src/layerManager.js'
import { createImageLayer } from './layers/media/imageLayer.js'

const width = 640
const height = 640
const size = { width, height }

const layers = [new Layer(size, await createImageLayer('/assets/images/lenna.png'))]

const projectSettings = {
    width,
    height,
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
player.start()

/*

// ----------------------
// Layer Setup
// ----------------------
const layer = new Layer(width, height, wigglyLines, {
    lineCount: 20, // Override default
    amplitude: (t) => 60 + Math.sin(t) * 10, // Custom animated value
})
const layer2 = new Layer(width, height, pulsingSquares, {
    // size: (t) => 20 + Math.sin(t) * 10, // pulse between 20–80px
    // color: (t) => step(0.5, ['#ff0080', '#00ffff', '#ffffff']),
    // rotation: (t) => osc(0.2), // subtle wiggle
})
const keyframed = new Layer(width, height, keyframeCircleLayer, {
    // Can override keyframes here if needed
})

const layers = [
    layer,
    layer2,
    keyframed,
    // new Layer(width, height, renderKnotLayer), // 3D knot layer
    // new Layer(width, height, renderReceiptEffect), // Uncomment to textify the receipt effect
    // new Layer(width, height, renderTextArtLayer), // Creative text art layer
]
    */

// Add debug layer that watches the rest
// TODO: fix this
// const debug = new Layer(width, height, createDebugLayer(layers))
// layers.push(debug)

// // Initialize all layers
// async function initializeLayers() {
//     console.log('Initializing layers...')
//     await Promise.all(layers.map((layer) => layer.init()))
//     console.log('All layers initialized')
//     // Initial render after layers are loaded
//     render(pauseOffset)
// }
