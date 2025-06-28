export const image = {
    defaultParams: {
        imagePath: '/assets/images/david.png',
        cropMode: 'contain', // 'contain' | 'cover' | 'fill'
    },

    async init(params) {
        this.img = new Image()
        return new Promise((resolve) => {
            this.img.onload = () => resolve()
            this.img.src = params.imagePath
        })
    },

    render(ctx, { width, height, cropMode }) {
        // Clear the canvas
        ctx.clearRect(0, 0, width, height)

        let x, y, scaledWidth, scaledHeight

        switch (cropMode) {
            case 'fill':
                // Stretch to fill entire area
                x = 0
                y = 0
                scaledWidth = width
                scaledHeight = height
                break

            case 'cover':
                // Fill entire area, cropping if needed
                const coverScale = Math.max(width / this.img.width, height / this.img.height)
                scaledWidth = this.img.width * coverScale
                scaledHeight = this.img.height * coverScale
                x = (width - scaledWidth) / 2
                y = (height - scaledHeight) / 2
                break

            case 'contain':
            default:
                // Fit within bounds (current behavior)
                const containScale = Math.min(width / this.img.width, height / this.img.height)
                scaledWidth = this.img.width * containScale
                scaledHeight = this.img.height * containScale
                x = (width - scaledWidth) / 2
                y = (height - scaledHeight) / 2
                break
        }

        ctx.drawImage(this.img, x, y, scaledWidth, scaledHeight)
    },
}
