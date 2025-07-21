/**
 * Threshold layer that converts pixels to black or white based on a threshold value
 */
export const threshold = {
    defaultParams: {
        threshold: 0.5,
        factor: 0.2,
        backgroundColor: '#000000',
        color: '#ffffff',
    },

    render(ctx, { inputCtx, width, height, threshold, backgroundColor, color, factor }) {
        if (!inputCtx) return

        // we are just going to write into the input canvas the updated values
        const imageData = inputCtx.getImageData(0, 0, width, height)
        const data = imageData.data

        // Parse hex color to RGB
        let hex = color.replace('#', '')
        const fgRGB = [
            parseInt(hex.substring(0, 2), 16),
            parseInt(hex.substring(2, 4), 16),
            parseInt(hex.substring(4, 6), 16),
        ]
        hex = backgroundColor.replace('#', '')
        const bgRGB = [
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
            let luminance = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255

            const adjust = Math.cos(luminance * Math.PI * 2.0) * 0.5 + 0.5
            luminance += adjust * factor

            // Apply threshold and set to foreground color if above threshold
            if (luminance > threshold) {
                data[i] = fgRGB[0] // R
                data[i + 1] = fgRGB[1] // G
                data[i + 2] = fgRGB[2] // B
            } else {
                data[i] = bgRGB[0] // R
                data[i + 1] = bgRGB[1] // G
                data[i + 2] = bgRGB[2] // B
            }
            // data[i + 3] is alpha, leave unchanged

            // data[i] = luminance * 255
            // data[i + 1] = luminance * 255
            // data[i + 2] = luminance * 255
        }

        // Put the processed image data back
        inputCtx.putImageData(imageData, 0, 0)
        ctx.drawImage(inputCtx.canvas, 0, 0)
    },
}
