export class Layer {
    constructor({ width, height }, renderFn, paramOverrides = {}) {
        this.canvas = document.createElement('canvas')
        this.canvas.width = width
        this.canvas.height = height
        this.ctx = this.canvas.getContext('2d')

        this.renderFn = renderFn

        // // If the renderFn is an object with defaultParams, merge them
        // const defaults = typeof renderFn === 'object' && renderFn.defaultParams ? renderFn.defaultParams : {}

        // this.params = { ...defaults, ...paramOverrides }
    }

    render(props = {}) {
        const resolution = {
            width: this.canvas.width,
            height: this.canvas.height,
        }

        // Evaluate any time-based params (functions of `t`)
        // const evaluatedParams = {}
        // for (const key in this.params) {
        //     const val = this.params[key]
        //     evaluatedParams[key] = typeof val === 'function' ? val(t) : val
        // }

        const fullProps = {
            ...props,
            resolution,
            //     params: evaluatedParams,
        }

        this.renderFn(this.ctx, fullProps)
    }

    getPixels() {
        return this.ctx
    }
}
