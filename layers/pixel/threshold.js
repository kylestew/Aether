/**
 * Threshold layer that converts pixels to black or white based on a threshold value
 */
export const threshold = {
    defaultParams: {
        threshold: 0.5,
        backgroundColor: '#000000',
        foregroundColor: '#ffffff',
    },

    render(ctx, { inputCtx, width, height, threshold, backgroundColor, foregroundColor }) {
        if (!inputCtx) return

        // Create a temporary canvas for the input
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        tempCanvas.width = width
        tempCanvas.height = height

        // Draw input to temp canvas
        const { width: inputWidth, height: inputHeight } = inputCtx.canvas
        tempCtx.drawImage(inputCtx.canvas, 0, 0, inputWidth, inputHeight, 0, 0, width, height)
        const imageData = tempCtx.getImageData(0, 0, inputWidth, inputHeight)
        const data = imageData.data

        // Parse hex color to RGB
        const hex = foregroundColor.replace('#', '')
        const fgRGB = [
            parseInt(hex.substring(0, 2), 16),
            parseInt(hex.substring(2, 4), 16),
            parseInt(hex.substring(4, 6), 16),
        ]

        // Clear main canvas and set background color
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, width, height)

        // Process pixels in chunks of 4 (RGBA)
        for (let i = 0; i < data.length; i += 4) {
            // Calculate luminance using standard formula
            const luminance = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255

            // Apply threshold and set to foreground color if above threshold
            if (luminance > threshold) {
                data[i] = fgRGB[0] // R
                data[i + 1] = fgRGB[1] // G
                data[i + 2] = fgRGB[2] // B
            } else {
                data[i] = 0 // R
                data[i + 1] = 0 // G
                data[i + 2] = 0 // B
            }
            // data[i + 3] is alpha, leave unchanged
        }

        // Put the processed image data back
        tempCtx.putImageData(imageData, 0, 0)
        ctx.drawImage(tempCanvas, 0, 0)
    },
}
