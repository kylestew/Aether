export class Layer {
    constructor(width, height, renderFn, paramOverrides = {}) {
        this.canvas = document.createElement('canvas')
        this.canvas.width = width
        this.canvas.height = height
        this.ctx = this.canvas.getContext('2d')

        this.renderFn = renderFn
        this.isLoaded = false
        this.loadPromise = null

        // If the renderFn is an object with defaultParams, merge them
        const defaults = typeof renderFn === 'object' && renderFn.defaultParams ? renderFn.defaultParams : {}

        this.params = { ...defaults, ...paramOverrides }
    }

    async init() {
        if (this.loadPromise) return this.loadPromise

        this.loadPromise = new Promise((resolve) => {
            if (this.renderFn.init) {
                this.renderFn.init().then(() => {
                    this.isLoaded = true
                    resolve()
                })
            } else {
                this.isLoaded = true
                resolve()
            }
        })

        return this.loadPromise
    }

    render(t, props = {}) {
        if (!this.isLoaded) return

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
            t,
            ...props,
            resolution,
            params: evaluatedParams,
        }

        if (typeof this.renderFn === 'function') {
            this.renderFn(this.ctx, fullProps)
        } else if (this.renderFn.render) {
            this.renderFn.render(this.ctx, fullProps)
        } else {
            console.error('Invalid render function provided to Layer')
        }
    }

    getPixels() {
        return this.ctx
    }
}
