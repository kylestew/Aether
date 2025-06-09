export const gradient = {
    defaultParams: {
        startColor: '#ff0000',
        endColor: '#0000ff',
        direction: 'horizontal', // 'horizontal' or 'vertical'
    },

    render(ctx, { width, height, startColor, endColor, direction }) {
        // Parse colors
        const startRGB = this._parseColor(startColor)
        const endRGB = this._parseColor(endColor)

        // Create image data for direct pixel manipulation
        const imageData = ctx.createImageData(width, height)
        const data = imageData.data

        // Generate gradient
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4

                // Calculate interpolation factor based on direction
                const t = direction === 'horizontal' ? x / width : y / height

                // Interpolate RGB values
                data[i] = Math.round(startRGB.r + (endRGB.r - startRGB.r) * t) // R
                data[i + 1] = Math.round(startRGB.g + (endRGB.g - startRGB.g) * t) // G
                data[i + 2] = Math.round(startRGB.b + (endRGB.b - startRGB.b) * t) // B
                data[i + 3] = 255 // Alpha
            }
        }

        // Put the pixel data back to canvas
        ctx.putImageData(imageData, 0, 0)
    },

    _parseColor(color) {
        // Remove # if present
        const hex = color.replace('#', '')

        // Parse hex to RGB
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16),
        }
    },
}
