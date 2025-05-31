export class Layer {
    constructor(width, height, renderFn) {
        this.canvas = document.createElement('canvas')
        this.canvas.width = width
        this.canvas.height = height
        this.ctx = this.canvas.getContext('2d')
        this.renderFn = renderFn
    }

    render(t, props = {}) {
        const fullProps = {
            t,
            ...props,
            resolution: {
                width: this.canvas.width,
                height: this.canvas.height,
            },
        }
        this.renderFn(this.ctx, fullProps)
    }

    getPixels() {
        return this.ctx
    }
}
