import { Layer } from './layerManager.js'
import { renderLayer1 } from './layers/layer1.js'
import { renderLayer2 } from './layers/layer2.js'

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
const layers = [
    new Layer(width, height, renderLayer1), // layer 1
    new Layer(width, height, renderLayer2), // layer 2
]

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
        const t = Math.min(elapsedSec, projectSettings.duration)
        updateFps(timestamp)
        render(t)
        lastRenderTime = elapsedMs
    }

    if (elapsedSec < projectSettings.duration) {
        requestAnimationFrame(animationLoop)
    } else {
        isPlaying = false
        playPauseBtn.textContent = '▶️ Play'
    }
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

// Initial render
render(pauseOffset)
