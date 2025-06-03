import { Layer } from './layerManager.js'
import { renderKnotLayer } from './layers/knotLayer.js'
import { renderReceiptEffect } from './layers/receiptEffect.js'
import { renderTextArtLayer } from './layers/textArtLayer.js'
import { wigglyLines } from './layers/wigglyLines.js'
import { pulsingSquares } from './layers/pulsingSquares.js'
import { createDebugLayer } from './layers/debugLayer.js'
import { keyframeCircleLayer } from './layers/keyframeLayer.js'

// grab DOM elements
const canvas = document.getElementById('output')
const ctx = canvas.getContext('2d')
const slider = document.getElementById('timelineSlider')
const timeLabel = document.getElementById('timeLabel')
const playPauseBtn = document.getElementById('playPause')
const fpsDisplay = document.getElementById('fpsDisplay')

const width = canvas.width
const height = canvas.height

const projectSettings = {
    duration: 10, // seconds
    targetFPS: 30, // cap rendering at 30 fps
}

const frameInterval = 1000 / projectSettings.targetFPS

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

// Add debug layer that watches the rest
// TODO: fix this
// const debug = new Layer(width, height, createDebugLayer(layers))
// layers.push(debug)

// Initialize all layers
async function initializeLayers() {
    console.log('Initializing layers...')
    await Promise.all(layers.map((layer) => layer.init()))
    console.log('All layers initialized')
    // Initial render after layers are loaded
    render(pauseOffset)
}

// Start initialization
initializeLayers().then(() => {
    // Auto-start animation on reload
    isPlaying = true
    startTime = null
    lastRenderTime = 0
    pauseOffset = parseFloat(slider.value)
    playPauseBtn.textContent = '⏸ Pause'
    requestAnimationFrame(animationLoop)
})

// ----------------------
// Playback State
// ----------------------
let isPlaying = false
let startTime = null
let pauseOffset = parseFloat(slider.value) // start point when paused
let lastRenderTime = 0

// ----------------------
// FPS Tracking
// ----------------------
let lastFrameTime = null
let lastFpsUpdate = 0
let frameCount = 0
let fps = 0

function updateFps(timestamp) {
    if (lastFrameTime !== null) {
        const delta = (timestamp - lastFrameTime) / 1000
        frameCount++
        if (timestamp - lastFpsUpdate > 500) {
            fps = Math.round(frameCount / ((timestamp - lastFpsUpdate) / 1000))
            fpsDisplay.textContent = `FPS: ${fps}`
            frameCount = 0
            lastFpsUpdate = timestamp
        }
    } else {
        lastFpsUpdate = timestamp
    }
    lastFrameTime = timestamp
}

// ----------------------
// Render Loop
// ----------------------
function render(t) {
    const frame = Math.floor(t * projectSettings.targetFPS)

    let inputCtx = null

    for (let i = 0; i < layers.length; i++) {
        layers[i].render(t, {
            frame,
            inputCtx,
            resolution: { width, height },
            layerIndex: i,
            totalTime: projectSettings.duration,
            totalFrames: Math.floor(projectSettings.duration * projectSettings.targetFPS),
        })
        inputCtx = layers[i].getPixels()
    }

    ctx.clearRect(0, 0, width, height)
    for (const layer of layers) {
        ctx.drawImage(layer.canvas, 0, 0)
    }

    timeLabel.textContent = `${t.toFixed(2)}s`
    slider.value = t.toFixed(2)
}

// ----------------------
// Animation Loop
// ----------------------
function animationLoop(timestamp) {
    if (!isPlaying) return

    if (startTime === null) startTime = timestamp

    const elapsedMs = timestamp - startTime
    const elapsedSec = elapsedMs / 1000 + pauseOffset

    if (elapsedMs - lastRenderTime >= frameInterval) {
        const t = elapsedSec % projectSettings.duration
        updateFps(timestamp)
        render(t)
        lastRenderTime = elapsedMs
    }

    requestAnimationFrame(animationLoop)
}

// ----------------------
// Controls
// ----------------------
playPauseBtn.addEventListener('click', () => {
    if (!isPlaying) {
        isPlaying = true
        startTime = null
        lastRenderTime = 0
        pauseOffset = parseFloat(slider.value)
        playPauseBtn.textContent = '⏸ Pause'
        requestAnimationFrame(animationLoop)
    } else {
        isPlaying = false
        pauseOffset = parseFloat(slider.value)
        playPauseBtn.textContent = '▶️ Play'
    }
})

slider.addEventListener('input', () => {
    const t = parseFloat(slider.value)
    timeLabel.textContent = `${t.toFixed(2)}s`
    if (!isPlaying) render(t)
})
