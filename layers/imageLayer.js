// Create image object
const img = new Image()

// Export both the render function and init function
export const renderImageLayer = {
    // Async initialization
    async init() {
        return new Promise((resolve) => {
            img.onload = () => resolve()
            img.src = '/assets/images/lenna.png'
        })
    },

    // Render function
    render(ctx, { resolution }) {
        const { width, height } = resolution

        // Clear the canvas
        ctx.clearRect(0, 0, width, height)

        // Draw the image centered and scaled to fit while maintaining aspect ratio
        const scale = Math.min(width / img.width, height / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale
        const x = (width - scaledWidth) / 2
        const y = (height - scaledHeight) / 2

        ctx.drawImage(img, x, y, scaledWidth, scaledHeight)
    },
}
