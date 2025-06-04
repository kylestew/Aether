export class Layer {
    constructor(layer, paramOverrides = {}) {
        this.layer = layer

        // Merge default params set on layer with overrides here
        const defaults = typeof layer === 'object' && layer.defaultParams ? layer.defaultParams : {}
        this.params = { ...defaults, ...paramOverrides }
    }

    async init(width, height) {
        this.canvas = document.createElement('canvas')
        this.canvas.width = width
        this.canvas.height = height
        this.ctx = this.canvas.getContext('2d')

        if (this.layer.init) {
            await this.layer.init(this.params)
        }
    }

    render(props = {}) {
        const { t } = props

        const resolution = {
            width: this.canvas.width,
            height: this.canvas.height,
        }

        // Evaluate any time-based params (functions of `t`)
        const evaluatedParams = {}
        for (const key in this.params) {
            const val = this.params[key]
            evaluatedParams[key] = typeof val === 'function' ? val(t) : val
        }

        const fullProps = {
            ...props,
            resolution,
            params: evaluatedParams,
        }

        this.layer.render(this.ctx, fullProps)
    }

    getPixels() {
        return this.ctx
    }
}
