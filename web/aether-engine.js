/**
 * AetherEngine - JavaScript wrapper for WASM Aether composition engine
 */

let wasmModule = null

export class AetherEngine {
    constructor() {
        this.wasmAether = null
        this.canvas = null
        this.ctx = null
        this.animationId = null
        this.isPlaying = false
        this.startTime = 0
    }

    /**
     * Initialize the engine with a canvas and composition
     * @param {HTMLCanvasElement} canvas - Target canvas element
     * @param {Object|string} composition - Composition object or JSON string
     */
    async init(canvas, composition) {
        if (!wasmModule) {
            // Import and initialize WASM module
            wasmModule = await import('./pkg/aether.js')
            await wasmModule.default()
            console.log('WASM module loaded')
        }

        this.canvas = canvas
        this.ctx = canvas.getContext('2d')

        // Convert composition to JSON string if it's an object
        const jsonString = typeof composition === 'string' ? composition : JSON.stringify(composition)

        try {
            this.wasmAether = new wasmModule.WasmAether(jsonString, canvas.width, canvas.height)
            console.log(`Aether engine initialized: ${canvas.width}x${canvas.height}`)
            console.log(`Layers: ${this.wasmAether.get_layer_count()}`)
        } catch (error) {
            console.error('Failed to initialize WASM Aether:', error)
            throw error
        }
    }

    /**
     * Render a single frame at the specified time
     * @param {number} time - Time in seconds
     */
    renderFrame(time = 0) {
        if (!this.wasmAether) {
            throw new Error('Engine not initialized')
        }

        try {
            const imageData = this.wasmAether.render(time)
            this.ctx.putImageData(imageData, 0, 0)
        } catch (error) {
            console.error('Render error:', error)
            throw error
        }
    }

    /**
     * Start animation loop
     */
    play() {
        if (this.isPlaying) return

        this.isPlaying = true
        this.startTime = performance.now()

        const animate = (currentTime) => {
            if (!this.isPlaying) return

            const elapsedTime = (currentTime - this.startTime) / 1000 // Convert to seconds
            this.renderFrame(elapsedTime)

            this.animationId = requestAnimationFrame(animate)
        }

        this.animationId = requestAnimationFrame(animate)
    }

    /**
     * Stop animation loop
     */
    stop() {
        this.isPlaying = false
        if (this.animationId) {
            cancelAnimationFrame(this.animationId)
            this.animationId = null
        }
    }

    /**
     * Resize the canvas and engine
     * @param {number} width - New width
     * @param {number} height - New height
     */
    resize(width, height) {
        if (!this.wasmAether) {
            throw new Error('Engine not initialized')
        }

        this.canvas.width = width
        this.canvas.height = height
        this.wasmAether.resize(width, height)
        console.log(`Resized to ${width}x${height}`)
    }

    /**
     * Update layer opacity
     * @param {number} layerIndex - Index of the layer
     * @param {number} opacity - Opacity value (0.0 - 1.0)
     */
    setLayerOpacity(layerIndex, opacity) {
        if (!this.wasmAether) {
            throw new Error('Engine not initialized')
        }

        try {
            this.wasmAether.update_layer_opacity(layerIndex, opacity)
        } catch (error) {
            console.error('Failed to update layer opacity:', error)
            throw error
        }
    }

    /**
     * Get the number of layers in the composition
     * @returns {number} Number of layers
     */
    getLayerCount() {
        if (!this.wasmAether) {
            throw new Error('Engine not initialized')
        }
        return this.wasmAether.get_layer_count()
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stop()
        if (this.wasmAether) {
            this.wasmAether.free()
            this.wasmAether = null
        }
    }
}

/**
 * Generic renderer class using the new WasmRenderer system
 * This can render any type (gradient, noise, colorbars, etc.)
 */
export class RendererEngine {
    constructor() {
        this.wasmRenderer = null
        this.animationId = null
        this.isPlaying = false
        this.startTime = 0
    }

    async init() {
        if (!wasmModule) {
            wasmModule = await import('./pkg/aether.js')
            await wasmModule.default()
        }
    }

    /**
     * Create a gradient renderer
     */
    async createGradient(startColor, endColor, horizontal = false) {
        await this.init()
        this.wasmRenderer = wasmModule.WasmRenderer.gradient(startColor, endColor, horizontal)
        return this
    }

    /**
     * Create a noise renderer
     */
    async createNoise(seed = 42) {
        await this.init()
        this.wasmRenderer = wasmModule.WasmRenderer.noise(seed)
        return this
    }

    /**
     * Render a single frame
     */
    render(canvas, time = 0) {
        if (!this.wasmRenderer) {
            throw new Error('Renderer not initialized')
        }

        const ctx = canvas.getContext('2d')
        const imageData = this.wasmRenderer.render_to_image_data(canvas.width, canvas.height, time)
        ctx.putImageData(imageData, 0, 0)
    }

    /**
     * Start animation loop
     */
    startAnimation(canvas) {
        if (this.isPlaying) return

        this.isPlaying = true
        this.startTime = performance.now()

        const animate = (currentTime) => {
            if (!this.isPlaying) return

            const elapsedTime = (currentTime - this.startTime) / 1000
            this.render(canvas, elapsedTime)

            this.animationId = requestAnimationFrame(animate)
        }

        this.animationId = requestAnimationFrame(animate)
    }

    /**
     * Stop animation
     */
    stopAnimation() {
        this.isPlaying = false
        if (this.animationId) {
            cancelAnimationFrame(this.animationId)
            this.animationId = null
        }
    }

    destroy() {
        this.stopAnimation()
        if (this.wasmRenderer) {
            this.wasmRenderer.free()
            this.wasmRenderer = null
        }
    }
}

// Legacy compatibility - still works but uses new system internally
export class WasmGradientRenderer {
    constructor() {
        this.wasmGradient = null
    }

    async init(startColor, endColor, horizontal = false) {
        if (!wasmModule) {
            wasmModule = await import('./pkg/aether.js')
            await wasmModule.default()
        }

        this.wasmGradient = new wasmModule.WasmGradient(startColor, endColor, horizontal)
    }

    render(canvas) {
        if (!this.wasmGradient) {
            throw new Error('Gradient renderer not initialized')
        }

        const ctx = canvas.getContext('2d')
        const imageData = this.wasmGradient.render_to_image_data(canvas.width, canvas.height)
        ctx.putImageData(imageData, 0, 0)
    }

    destroy() {
        if (this.wasmGradient) {
            this.wasmGradient.free()
            this.wasmGradient = null
        }
    }
}

export class WasmNoiseRenderer {
    constructor() {
        this.wasmNoise = null
    }

    async init(seed = 42) {
        if (!wasmModule) {
            wasmModule = await import('./pkg/aether.js')
            await wasmModule.default()
        }

        this.wasmNoise = new wasmModule.WasmNoise(seed)
    }

    render(canvas, time = 0) {
        if (!this.wasmNoise) {
            throw new Error('Noise renderer not initialized')
        }

        const ctx = canvas.getContext('2d')
        const imageData = this.wasmNoise.render_to_image_data(canvas.width, canvas.height, time)
        ctx.putImageData(imageData, 0, 0)
    }

    destroy() {
        if (this.wasmNoise) {
            this.wasmNoise.free()
            this.wasmNoise = null
        }
    }
}
