export async function createImageLayer(imagePath) {
    // TODO: I'm sure there is a better way to do this
    const img = new Image()
    const imgLoader = new Promise((resolve) => {
        img.onload = () => resolve()
        img.src = imagePath
    })
    await Promise.all([imgLoader])

    function render(ctx, { resolution }) {
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
    }
    return render
}
