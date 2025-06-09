function RGB(r, g, b) {
    return [r / 255, g / 255, b / 255]
}

export const cgaDither = {
    CGAPalette: [
        RGB(0, 0, 0), // Black
        RGB(255, 85, 255), // Magenta
        RGB(85, 255, 255), // Cyan
        RGB(255, 255, 255), // White
    ],

    defaultParams: {
        useBayerDither: true,
    },

    // 8x8 Bayer matrix for dithering
    bayerMatrix: [
        [0, 48, 12, 60, 3, 51, 15, 63],
        [32, 16, 44, 28, 35, 19, 47, 31],
        [8, 56, 4, 52, 11, 59, 7, 55],
        [40, 24, 36, 20, 43, 27, 39, 23],
        [2, 50, 14, 62, 1, 49, 13, 61],
        [34, 18, 46, 30, 33, 17, 45, 29],
        [10, 58, 6, 54, 9, 57, 5, 53],
        [42, 26, 38, 22, 41, 25, 37, 21],
    ],

    // Quantize grayscale brightness to palette (no dithering)
    blendToCGAPalette(brightness) {
        // Clamp brightness between 0 and 1
        brightness = Math.max(0, Math.min(1, brightness))

        const PAL_SIZE = this.CGAPalette.length
        const scaled = brightness * (PAL_SIZE - 1) // e.g. 0–3 range
        const index = Math.floor(scaled)
        const t = scaled - index

        // Get lower and upper palette colors
        const c1 = this.CGAPalette[index]
        const c2 = this.CGAPalette[Math.min(index + 1, PAL_SIZE - 1)]

        // Interpolate between them
        const mix = (a, b, t) => a * (1 - t) + b * t
        return [
            mix(c1[0], c2[0], t), //
            mix(c1[1], c2[1], t),
            mix(c1[2], c2[2], t),
        ]
    },

    quantizeToCGAPalette(brightness) {
        brightness = Math.max(0, Math.min(1, brightness))
        const PAL_SIZE = this.CGAPalette.length
        const index = Math.round(brightness * (PAL_SIZE - 1)) // hard snap to closest
        return this.CGAPalette[index]
    },

    render(ctx, { t, inputCtx, resolution, params = {} }) {
        if (!inputCtx) return

        const { width, height } = resolution
        const { useBayerDither = this.defaultParams.useBayerDither } = params
        const inputData = inputCtx.getImageData(0, 0, width, height)
        const outputData = ctx.createImageData(width, height)
        const input = inputData.data
        const output = outputData.data

        // Process each pixel
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4

                // Convert input pixel to grayscale brightness (0.0–1.0)
                const r = input[idx] / 255
                const g = input[idx + 1] / 255
                const b = input[idx + 2] / 255
                let brightness = 0.299 * r + 0.587 * g + 0.114 * b

                // Apply Bayer dithering if enabled
                if (useBayerDither) {
                    const bayerValue = this.bayerMatrix[y % 8][x % 8] / 64 // Normalize to 0-1
                    brightness = Math.min(1, Math.max(0, brightness + (bayerValue - 0.5) * 0.25))
                }

                // Quantize to nearest palette colors
                const closestColor = this.quantizeToCGAPalette(brightness)
                // const closestColor = this.blendToCGAPalette(brightness)

                // Set the output pixel to the closest palette color
                output[idx] = Math.round(closestColor[0] * 255)
                output[idx + 1] = Math.round(closestColor[1] * 255)
                output[idx + 2] = Math.round(closestColor[2] * 255)
                output[idx + 3] = input[idx + 3] // Preserve alpha
            }
        }

        // Draw the quantized result
        ctx.putImageData(outputData, 0, 0)
    },
}
