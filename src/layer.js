/**
 * Layer class that manages a single layer in the composition
 */
export class Layer {
    /**
     * @param {Object} layer controls - {width, height, blendMode} of the layer
     * @param {Object} renderer - Layer renderer object with render method
     * @param {Object} params - Parameters for the layer
     */
    constructor(controls, renderer, params = {}) {
        const { size, blendMode, opacity = 1.0 } = controls
        this.width = size[0]
        this.height = size[1]
        this.blendMode = blendMode || 'normal'
        this.opacity = opacity

        this.renderer = renderer
        // merge default params with user specified (overriding)
        this.params = { ...renderer.defaultParams, ...params }

        // Create layer canvas
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.ctx = this.canvas.getContext('2d')
        // this.ctx.imageSmoothingEnabled = false // Ensure crisp pixel art scaling
    }

    async init() {
        if (this.renderer.init) {
            await this.renderer.init(this.params)
        }
    }

    reset() {
        if (this.renderer.reset) {
            this.renderer.reset(this.params)
        }
    }

    // Used to draw into the composite context so it can be read
    // from and blend into the next layer
    // upscaling to the main canvas happens here
    applyBlendMode(targetCtx) {
        const { width: ourWidth, height: ourHeight } = this.canvas
        const { width: theirWidth, height: theirHeight } = targetCtx.canvas

        // Save current state (composite and alpha)
        const prevComposite = targetCtx.globalCompositeOperation
        const prevAlpha = targetCtx.globalAlpha

        // Set blend mode and opacity
        targetCtx.globalCompositeOperation = this.blendMode
        targetCtx.globalAlpha = this.opacity

        // Draw the layer with blending and opacity
        targetCtx.drawImage(this.canvas, 0, 0, ourWidth, ourHeight, 0, 0, theirWidth, theirHeight)

        // Restore previous state
        targetCtx.globalAlpha = prevAlpha
        targetCtx.globalCompositeOperation = prevComposite
    }

    render(inputCtx, params) {
        const { t } = params

        // Clear the layer canvas
        this.ctx.clearRect(0, 0, this.width, this.height)

        // Evaluate any time-based params (functions of `t`)
        const evaluatedParams = {}
        for (const key in this.params) {
            const val = this.params[key]
            evaluatedParams[key] = typeof val === 'function' ? val(params.pct, t) : val
        }

        // if the input canvas doesn't match our size, scale into a new canvas
        let processedInputCtx = inputCtx
        if (inputCtx.canvas.width !== this.width || inputCtx.canvas.height !== this.height) {
            const tempCanvas = document.createElement('canvas')
            const tempCtx = tempCanvas.getContext('2d')
            tempCanvas.width = this.width
            tempCanvas.height = this.height
            const { width: inputWidth, height: inputHeight } = inputCtx.canvas
            tempCtx.drawImage(inputCtx.canvas, 0, 0, inputWidth, inputHeight, 0, 0, this.width, this.height)
            processedInputCtx = tempCtx
        }

        this.renderer.render(this.ctx, {
            ...evaluatedParams,
            ...params,
            width: this.width,
            height: this.height,
            inputCtx: processedInputCtx,
        })
    }

    getPixels() {
        return this.ctx
    }
}

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
