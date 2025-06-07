export const paletteQuantization = {
    defaultParams: {
        palette: [
            [0, 0, 0], // Black
            [255, 255, 255], // White
            [255, 0, 0], // Red
            [0, 255, 0], // Green
            [0, 0, 255], // Blue
            [255, 255, 0], // Yellow
            [255, 0, 255], // Magenta
            [0, 255, 255], // Cyan
            [128, 128, 128], // Gray
            [128, 0, 0], // Dark Red
            [0, 128, 0], // Dark Green
            [0, 0, 128], // Dark Blue
            [128, 128, 0], // Dark Yellow
            [128, 0, 128], // Dark Magenta
            [0, 128, 128], // Dark Cyan
            [192, 192, 192], // Light Gray
        ],
    },

    // Calculate color distance using weighted RGB
    colorDistance(r1, g1, b1, r2, g2, b2) {
        // Using weighted RGB to account for human perception
        const rmean = (r1 + r2) / 2
        const r = r1 - r2
        const g = g1 - g2
        const b = b1 - b2
        return Math.sqrt((2 + rmean / 256) * r * r + 4 * g * g + (2 + (255 - rmean) / 256) * b * b)
    },

    // Find the closest color in the palette
    findClosestColor(r, g, b, palette) {
        let minDist = Infinity
        let closestColor = palette[0]

        for (const color of palette) {
            const dist = this.colorDistance(r, g, b, color[0], color[1], color[2])
            if (dist < minDist) {
                minDist = dist
                closestColor = color
            }
        }

        return closestColor
    },

    render(ctx, { t, inputCtx, resolution, params }) {
        if (!inputCtx) return

        const { width, height } = resolution
        const { palette } = params

        const inputData = inputCtx.getImageData(0, 0, width, height)
        const outputData = ctx.createImageData(width, height)
        const input = inputData.data
        const output = outputData.data

        // Process each pixel
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4
                const closestColor = this.findClosestColor(input[idx], input[idx + 1], input[idx + 2], palette)

                // Set the output pixel to the closest palette color
                output[idx] = closestColor[0]
                output[idx + 1] = closestColor[1]
                output[idx + 2] = closestColor[2]
                output[idx + 3] = input[idx + 3] // Preserve alpha
            }
        }

        // Draw the quantized result
        ctx.putImageData(outputData, 0, 0)
    },
}
