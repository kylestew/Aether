import { AetherEngine, WasmGradientRenderer, WasmNoiseRenderer, RendererEngine } from './aether-engine.js'

let engine = null
let gradientRenderer = null
let noiseRenderer = null
let genericRenderer = null

const canvas = document.getElementById('mainCanvas')
const status = document.getElementById('status')

// UI elements
const initBtn = document.getElementById('initBtn')
const playBtn = document.getElementById('playBtn')
const stopBtn = document.getElementById('stopBtn')
const compositionSelect = document.getElementById('compositionSelect')
const layerOpacity = document.getElementById('layerOpacity')
const layer1Opacity = document.getElementById('layer1Opacity')
const opacityValue = document.getElementById('opacityValue')
const opacity1Value = document.getElementById('opacity1Value')
const gradientTestBtn = document.getElementById('gradientTestBtn')
const noiseTestBtn = document.getElementById('noiseTestBtn')
const genericGradientBtn = document.getElementById('genericGradientBtn')
const genericNoiseBtn = document.getElementById('genericNoiseBtn')
const resizeBtn = document.getElementById('resizeBtn')

// Predefined compositions
const compositions = {
    simple: {
        layers: [
            {
                type: 'gradient',
                a: 16777215, // white
                b: 255, // blue
                direction: 'vertical',
            },
        ],
    },
    complex: {
        layers: [
            {
                type: 'gradient',
                a: 16777215, // white
                b: 0, // black
                direction: 'horizontal',
            },
            {
                type: 'noise',
                seed: 42,
                blend: 'multiply',
                opacity: 0.3,
            },
        ],
    },
    colorbars: {
        layers: [
            {
                type: 'colorbars',
                direction: 'vertical',
                blend: 'normal',
                opacity: 1.0,
            },
        ],
    },
}

function updateStatus(message) {
    status.textContent = message
    console.log(message)
}

// Initialize engine
initBtn.addEventListener('click', async () => {
    try {
        updateStatus('Initializing WASM engine...')
        initBtn.disabled = true

        engine = new AetherEngine()
        const selectedComposition = compositions[compositionSelect.value]

        await engine.init(canvas, selectedComposition)

        // Enable controls
        playBtn.disabled = false
        stopBtn.disabled = false
        layerOpacity.disabled = false
        if (engine.getLayerCount() > 1) {
            layer1Opacity.disabled = false
        }

        // Render first frame
        engine.renderFrame(0)
        updateStatus(`Engine ready - ${engine.getLayerCount()} layers loaded`)
    } catch (error) {
        updateStatus(`Error: ${error.message}`)
        initBtn.disabled = false
    }
})

// Play/stop controls
playBtn.addEventListener('click', () => {
    engine.play()
    updateStatus('Playing...')
})

stopBtn.addEventListener('click', () => {
    engine.stop()
    updateStatus('Stopped')
})

// Layer opacity controls
layerOpacity.addEventListener('input', (e) => {
    const opacity = parseFloat(e.target.value)
    opacityValue.textContent = opacity.toFixed(1)
    if (engine) {
        engine.setLayerOpacity(0, opacity)
        if (!engine.isPlaying) {
            engine.renderFrame(0) // Update if not playing
        }
    }
})

layer1Opacity.addEventListener('input', (e) => {
    const opacity = parseFloat(e.target.value)
    opacity1Value.textContent = opacity.toFixed(1)
    if (engine && engine.getLayerCount() > 1) {
        engine.setLayerOpacity(1, opacity)
        if (!engine.isPlaying) {
            engine.renderFrame(0) // Update if not playing
        }
    }
})

// Generic renderer tests (using new system)
if (genericGradientBtn) {
    genericGradientBtn.addEventListener('click', async () => {
        try {
            updateStatus('Testing generic gradient renderer...')

            if (genericRenderer) {
                genericRenderer.destroy()
            }

            genericRenderer = new RendererEngine()
            await genericRenderer.createGradient(0xff0000, 0x0000ff, true) // red to blue, horizontal

            genericRenderer.render(canvas)
            updateStatus('Generic gradient test complete - using shared Rust code!')
        } catch (error) {
            updateStatus(`Generic gradient test error: ${error.message}`)
        }
    })
}

if (genericNoiseBtn) {
    genericNoiseBtn.addEventListener('click', async () => {
        try {
            updateStatus('Testing generic noise renderer...')

            if (genericRenderer) {
                genericRenderer.destroy()
            }

            genericRenderer = new RendererEngine()
            await genericRenderer.createNoise(Math.floor(Math.random() * 1000))

            // Animate for 3 seconds
            genericRenderer.startAnimation(canvas)
            setTimeout(() => {
                genericRenderer.stopAnimation()
                updateStatus('Generic noise test complete - zero code duplication!')
            }, 3000)
        } catch (error) {
            updateStatus(`Generic noise test error: ${error.message}`)
        }
    })
}

// Legacy standalone gradient test
gradientTestBtn.addEventListener('click', async () => {
    try {
        updateStatus('Testing legacy gradient...')

        if (!gradientRenderer) {
            gradientRenderer = new WasmGradientRenderer()
            await gradientRenderer.init(
                0xff0000, // red
                0x0000ff, // blue
                document.getElementById('gradientDirection').value === 'true'
            )
        }

        gradientRenderer.render(canvas)
        updateStatus('Legacy gradient test complete')
    } catch (error) {
        updateStatus(`Gradient test error: ${error.message}`)
    }
})

// Legacy standalone noise test
noiseTestBtn.addEventListener('click', async () => {
    try {
        updateStatus('Testing legacy noise...')

        const seed = parseInt(document.getElementById('noiseSeed').value)

        if (noiseRenderer) {
            noiseRenderer.destroy()
        }

        noiseRenderer = new WasmNoiseRenderer()
        await noiseRenderer.init(seed)

        // Animate noise for 3 seconds
        let startTime = performance.now()
        const animateNoise = (currentTime) => {
            const elapsed = (currentTime - startTime) / 1000
            if (elapsed < 3) {
                noiseRenderer.render(canvas, elapsed)
                requestAnimationFrame(animateNoise)
            } else {
                updateStatus('Legacy noise test complete')
            }
        }
        requestAnimationFrame(animateNoise)
    } catch (error) {
        updateStatus(`Noise test error: ${error.message}`)
    }
})

// Resize canvas
resizeBtn.addEventListener('click', () => {
    const width = parseInt(document.getElementById('canvasWidth').value)
    const height = parseInt(document.getElementById('canvasHeight').value)

    if (engine) {
        engine.resize(width, height)
        engine.renderFrame(0)
        updateStatus(`Resized to ${width}x${height}`)
    } else {
        canvas.width = width
        canvas.height = height
        updateStatus(`Canvas resized to ${width}x${height} (engine not initialized)`)
    }
})

// Composition change
compositionSelect.addEventListener('change', () => {
    if (engine) {
        updateStatus('Please re-initialize to change composition')
        initBtn.disabled = false
        playBtn.disabled = true
        stopBtn.disabled = true
        layerOpacity.disabled = true
        layer1Opacity.disabled = true
    }
})

// Initialize status
updateStatus('Ready - Click "Initialize Engine" to start')
