import { createPlayer } from './src/player.js'
import { Layer } from './src/layerManager.js'

import { emptyLayer } from './layers/emptyLayer.js'
import { pixelGradientLayer } from './layers/generators/pixelGradientLayer.js'
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

// 135 x 240 mode
// MODES AVAILABLE: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
const mode = 60
const width = 1080 / mode
const height = 1920 / mode

// TODO: palette mode as well
// CURRENTLY 1-BIT

const imagePath = '/assets/images/pearl.png'
// const imagePath = '/assets/images/david.png'

const glsl = (x) => x[0] // Dummy function for highlighting

const fragSource = glsl`
precision highp float;
uniform vec2 iResolution;
uniform float iTime;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 p = uv * iTime / 10.0;

    vec3 color = vec3(uv, p);
    gl_FragColor = vec4(color, 1.0);
}
`

const layers = [
    // new Layer(emptyLayer, { color: 'red' }),
    new Layer(pixelGradientLayer, {
        startColor: '#ffffff',
        endColor: '#000000',
        direction: 'vertical',
    }),

    new Layer(shaderLayer, { fragmentShader: fragSource }),

    // new Layer(imageLayer, { imagePath, cropMode: 'cover' }),
    // new Layer(pulsingSquares),
    // new Layer(scanLines),
    // new Layer(simple3DLayer),

    // new Layer(pixelateLayer, { pixelSize: 4 }),

    // new Layer(receiptEffect),
    // new Layer(dottedHalftoneEffect),
    // new Layer(asciiDitherLayer, { cellSize: 12 }),
    // new Layer(bayerDither),

    // new Layer(pixelateLayer, { pixelSize: 24 }),

    // new Layer(size, scanLines, {
    //     lineCount: 20, // Override default
    //     color: '#E0F234',
    //     amplitude: (t) => 60 + Math.sin(t) * 10, // Custom animated value
    // }),
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
