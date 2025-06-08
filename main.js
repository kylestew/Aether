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

// 135 x 240 mode
// MODES AVAILABLE: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
// MODE 6 is closest to CGA mode 0 (320x200(CGA) - 320x180 (ours))
const mode = 6
const width = 1080 / mode
const height = 1920 / mode

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
// const imagePath = '/assets/images/david.png'

const glsl = (x) => x[0] // Dummy function for highlighting
const fragSource = glsl`
precision highp float;
uniform vec2 iResolution;
uniform float iTime;

#define MAX_STEPS 100 
#define MAX_DIST 100.0
#define SURFACE_DIST 0.001

float sdSphere(vec3 p, float s) {
    return length(p) - s;
}

float scene(vec3 p) {
    vec3 spherePos = vec3(cos(iTime), 1.0, 5.0 + sin(iTime));
    float distToSphere = sdSphere(p - spherePos, 1.0);

    float distToPlane = p.y + 0.1;

    return min(distToSphere, distToPlane);
}

// General-purpose ray marcher with a maxDistance limit
// Returns -1.0 if no hit, or distance to the hit point
float rayMarch(vec3 ro, vec3 rd, float maxDist) {
    float t = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 pos = ro + rd * t;
        float d = scene(pos);
        if (d < SURFACE_DIST) return t;      // Hit something
        t += d;
        if (t > maxDist) break;              // Gave up before hitting
    }
    return -1.0; // Didn't hit anything
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);

    float dx = scene(p + e.xyy) - scene(p - e.xyy);
    float dy = scene(p + e.yxy) - scene(p - e.yxy);
    float dz = scene(p + e.yyx) - scene(p - e.yyx);
    
    return normalize(vec3(dx, dy, dz));
}

float shadow(vec3 point, vec3 lightPos) {
    vec3 dirToLight = normalize(lightPos - point);
    float maxDist = length(lightPos - point);

    float t = rayMarch(point + dirToLight * 0.01, dirToLight, maxDist);
    return (t > 0.0) ? 0.0 : 1.0; // Blocked = shadow, clear = lit
}

float lighting(vec3 lightPos, vec3 point) {
    vec3 lightDir = normalize(lightPos - point);
    vec3 normal = getNormal(point);

    float diff = clamp(dot(normal, lightDir), 0.0, 1.0);
    float shadowFactor = shadow(point + normal * 0.01, lightPos);

    return diff * shadowFactor;
}

void main() {
    vec2 uv = (gl_FragCoord.xy / iResolution.xy) * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y; // correct for aspect ratio

    // setup camera - behind origin, looking forward
    vec3 ro = vec3(0, 1.5, -1.0); 

    // light position - moving
    vec3 lightPos = vec3(1, 5, 1);
    lightPos.xz += vec2(sin(iTime), cos(iTime)) * 2.0;

    // ray direction (from camera to scene)
    vec3 rd = normalize(vec3(uv, 1.0));

    // ray marching
    float d = rayMarch(ro, rd, MAX_DIST);
    if (d < 0.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // background color
        return;
    }

    // light calculation
    vec3 p = ro + rd * d;
    float diff = lighting(lightPos, p);
    vec3 color = vec3(1.0) * diff;

    gl_FragColor = vec4(color, 1.0);
}
`

const layers = [
    new Layer(emptyLayer, { color: 'red' }),
    // new Layer(gradientLayer, {
    //     startColor: '#ffffff',
    //     endColor: '#000000',
    //     direction: 'vertical',
    // }),

    new Layer(shaderLayer, { fragSource }),

    // new Layer(imageLayer, { imagePath, cropMode: 'cover' }),

    // TODO: apply the actual dither!

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
