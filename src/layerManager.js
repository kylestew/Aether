/**
 * Layer class that manages a single layer in the composition
 */
export class Layer {
    /**
     * @param {[number, number]} size - [width, height] of the layer
     * @param {Object} renderer - Layer renderer object with render method
     * @param {Object} params - Parameters for the layer
     * @param {string} [params.blendMode='normal'] - Blend mode for this layer
     */
    constructor(size, renderer, params = {}) {
        this.size = size
        this.renderer = renderer
        this.params = { ...renderer.defaultParams, ...params }
        this.blendMode = params.blendMode || 'normal'

        // Create layer canvas
        this.canvas = document.createElement('canvas')
        this.canvas.width = size[0]
        this.canvas.height = size[1]
        this.ctx = this.canvas.getContext('2d')
        this.ctx.imageSmoothingEnabled = false // Ensure crisp pixel art scaling
    }

    /**
     * Initialize the layer
     */
    async init() {
        if (this.renderer.init) {
            await this.renderer.init(this.params)
        }
    }

    /**
     * Apply blend mode to the current layer onto the target context
     * @param {CanvasRenderingContext2D} targetCtx - Target context to blend onto
     */
    applyBlendMode(targetCtx) {
        const { width, height } = this.canvas

        // Get the current composite operation
        const prevComposite = targetCtx.globalCompositeOperation

        // Set the blend mode
        targetCtx.globalCompositeOperation = this.blendMode

        // Draw the layer
        targetCtx.drawImage(this.canvas, 0, 0)

        // Restore previous composite operation
        targetCtx.globalCompositeOperation = prevComposite
    }

    /**
     * Render the layer
     */
    render(t, inputCtx, params) {
        // Clear the layer canvas
        const { width, height } = params
        this.ctx.clearRect(0, 0, width, height)

        // Evaluate any time-based params (functions of `t`)
        const evaluatedParams = {}
        for (const key in this.params) {
            const val = this.params[key]
            evaluatedParams[key] = typeof val === 'function' ? val(t) : val
        }

        // If we have an input context and its resolution doesn't match this layer's resolution,
        // create a temporary canvas to upscale it
        let processedInputCtx = inputCtx
        if (inputCtx && (inputCtx.canvas.width !== this.size[0] || inputCtx.canvas.height !== this.size[1])) {
            const tempCanvas = document.createElement('canvas')
            tempCanvas.width = this.size[0]
            tempCanvas.height = this.size[1]
            const tempCtx = tempCanvas.getContext('2d')
            tempCtx.imageSmoothingEnabled = false // Ensure crisp pixel art scaling

            // Draw input at upscaled size
            tempCtx.drawImage(
                inputCtx.canvas,
                0,
                0,
                inputCtx.canvas.width,
                inputCtx.canvas.height,
                0,
                0,
                this.size[0],
                this.size[1]
            )
            processedInputCtx = tempCtx
        }

        // Render the layer, passing through all resolution parameters
        this.renderer.render(this.ctx, {
            ...evaluatedParams,
            ...params,
            t,
            inputCtx: processedInputCtx,
        })
    }

    getPixels() {
        return this.ctx
    }
}

/**
 * Blend modes available for layers
 * @type {string[]}
 */
export const BLEND_MODES = [
    'normal',
    'multiply',
    'screen',
    'overlay',
    'darken',
    'lighten',
    'color-dodge',
    'color-burn',
    'hard-light',
    'soft-light',
    'difference',
    'exclusion',
    'hue',
    'saturation',
    'color',
    'luminosity',
]
