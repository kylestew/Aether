export const imageLayer = {
    defaultParams: {
        imagePath: '/assets/images/david.png',
    },

    async init(params) {
        this.img = new Image()
        return new Promise((resolve) => {
            this.img.onload = () => resolve()
            this.img.src = params.imagePath
        })
    },

    render(ctx, { resolution }) {
        const { width, height } = resolution

        // Clear the canvas
        ctx.clearRect(0, 0, width, height)

        // Draw the image centered and scaled to fit while maintaining aspect ratio
        const scale = Math.min(width / this.img.width, height / this.img.height)
        const scaledWidth = this.img.width * scale
        const scaledHeight = this.img.height * scale
        const x = (width - scaledWidth) / 2
        const y = (height - scaledHeight) / 2

        ctx.drawImage(this.img, x, y, scaledWidth, scaledHeight)
    },
}
