export class Layer {
    constructor(width, height, renderFn) {
        this.canvas = document.createElement('canvas')
        this.canvas.width = width
        this.canvas.height = height
        this.ctx = this.canvas.getContext('2d')
        this.renderFn = renderFn
        this.isLoaded = false
        this.loadPromise = null
    }

    async init() {
        if (this.loadPromise) return this.loadPromise

        this.loadPromise = new Promise((resolve) => {
            // If renderFn has an init method, call it
            if (this.renderFn.init) {
                this.renderFn.init().then(() => {
                    this.isLoaded = true
                    resolve()
                })
            } else {
                // If no init needed, mark as loaded immediately
                this.isLoaded = true
                resolve()
            }
        })

        return this.loadPromise
    }

    render(t, props = {}) {
        if (!this.isLoaded) return

        const fullProps = {
            t,
            ...props,
            resolution: {
                width: this.canvas.width,
                height: this.canvas.height,
            },
        }

        // Handle both function-style and object-style render functions
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
