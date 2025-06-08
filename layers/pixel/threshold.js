/**
 * Threshold layer that converts pixels to black or white based on a threshold value
 */
export const threshold = {
    defaultParams: {
        threshold: 0.5,
        backgroundColor: '#000',
        foregroundColor: '#fff',
    },

    render(ctx, { t, inputCtx, resolution, params }) {
        if (!inputCtx) return

        const { width, height } = resolution

        // Create a temporary canvas for the input
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        tempCanvas.width = width
        tempCanvas.height = height

        // Draw input to temp canvas
        tempCtx.drawImage(inputCtx.canvas, 0, 0)
        const imageData = tempCtx.getImageData(0, 0, width, height)
        const data = imageData.data

        // Clear main canvas and set background color
        ctx.fillStyle = params.backgroundColor
        ctx.fillRect(0, 0, width, height)

        // Process pixels in chunks of 4 (RGBA)
        for (let i = 0; i < data.length; i += 4) {
            // Calculate luminance using standard formula
            const luminance = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255

            // Apply threshold
            const value = luminance > params.threshold ? 255 : 0

            // Set RGB to the thresholded value, preserve alpha
            data[i] = value // R
            data[i + 1] = value // G
            data[i + 2] = value // B
            // data[i + 3] is alpha, leave unchanged
        }

        // Put the processed image data back
        tempCtx.putImageData(imageData, 0, 0)
        ctx.drawImage(tempCanvas, 0, 0)
    },
}
