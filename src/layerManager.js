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
        this.width = size[0]
        this.height = size[1]
        this.renderer = renderer
        // merge default params with user specified (overriding)
        this.params = { ...renderer.defaultParams, ...params }
        this.blendMode = params.blendMode || 'normal'

        // Create layer canvas
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.ctx = this.canvas.getContext('2d')
        this.ctx.imageSmoothingEnabled = false // Ensure crisp pixel art scaling

        console.log('layer has canvas of', this.width, this.height)
    }

    async init() {
        if (this.renderer.init) {
            await this.renderer.init(this.params)
        }
    }

    // Used to draw into the composite context so it can be read
    // from and blend into the next layer
    // upscaling to the main canvas happens here
    applyBlendMode(targetCtx) {
        const { width: ourWidth, height: ourHeight } = this.canvas
        const { width: theirWidth, height: theirHeight } = targetCtx.canvas

        // Get the current composite operation
        const prevComposite = targetCtx.globalCompositeOperation

        // Set the blend mode
        targetCtx.globalCompositeOperation = this.blendMode

        // Draw the layer
        targetCtx.drawImage(this.canvas, 0, 0, ourWidth, ourHeight, 0, 0, theirWidth, theirHeight)

        // Restore previous composite operation
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
            evaluatedParams[key] = typeof val === 'function' ? val(t) : val
        }

        // create a temporary canvas to upscale it
        let processedInputCtx = inputCtx
        // if (inputCtx && (inputCtx.canvas.width !== this.size[0] || inputCtx.canvas.height !== this.size[1])) {
        //     const tempCanvas = document.createElement('canvas')
        //     tempCanvas.width = this.size[0]
        //     tempCanvas.height = this.size[1]
        //     const tempCtx = tempCanvas.getContext('2d')
        //     tempCtx.imageSmoothingEnabled = false // Ensure crisp pixel art scaling

        //     // Draw input at upscaled size
        //     tempCtx.drawImage(
        //         inputCtx.canvas,
        //         0,
        //         0,
        //         inputCtx.canvas.width,
        //         inputCtx.canvas.height,
        //         0,
        //         0,
        //         this.size[0],
        //         this.size[1]
        //     )
        //     processedInputCtx = tempCtx
        // }

        // Render the layer, passing through all resolution parameters
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
