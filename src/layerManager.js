export class Layer {
    constructor(size, layer, paramOverrides = {}) {
        this.width = size[0]
        this.height = size[1]
        this.layer = layer

        // Merge default params set on layer with overrides here
        const defaults = typeof layer === 'object' && layer.defaultParams ? layer.defaultParams : {}
        this.params = { ...defaults, ...paramOverrides }
    }

    async init() {
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.ctx = this.canvas.getContext('2d')
        this.ctx.imageSmoothingEnabled = false // Ensure crisp pixel art scaling

        if (this.layer.init) {
            await this.layer.init(this.params)
        }
    }

    render(props = {}) {
        const { t, inputCtx } = props

        const resolution = {
            width: this.canvas.width,
            height: this.canvas.height,
        }

        // If we have an input context and its resolution doesn't match this layer's resolution,
        // create a temporary canvas to upscale it
        let processedInputCtx = inputCtx
        if (inputCtx && (inputCtx.canvas.width !== this.width || inputCtx.canvas.height !== this.height)) {
            const tempCanvas = document.createElement('canvas')
            tempCanvas.width = this.width
            tempCanvas.height = this.height
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
                this.width,
                this.height
            )
            processedInputCtx = tempCtx
        }

        // Evaluate any time-based params (functions of `t`)
        const evaluatedParams = {}
        for (const key in this.params) {
            const val = this.params[key]
            evaluatedParams[key] = typeof val === 'function' ? val(t) : val
        }

        const fullProps = {
            ...props,
            inputCtx: processedInputCtx,
            resolution,
            params: evaluatedParams,
        }

        this.layer.render(this.ctx, fullProps)
    }

    getPixels() {
        return this.ctx
    }
}
