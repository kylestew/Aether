export const posterize = {
    defaultParams: {
        numBins: 4, // Number of quantization levels per channel
    },

    render(ctx, { inputCtx, width, height, numBins }) {
        if (!inputCtx) return

        const binSize = 256 / numBins

        // Get input image data
        const inputData = inputCtx.getImageData(0, 0, width, height)
        const outputData = ctx.createImageData(width, height)
        const input = inputData.data
        const output = outputData.data

        // Quantize each pixel
        for (let i = 0; i < input.length; i += 4) {
            for (let j = 0; j < 3; j++) {
                const value = input[i + j]
                // Uniform quantization with midpoint rounding
                let quantized = binSize * (Math.floor(value / binSize) + 0.5)
                // let quantized = binSize * Math.floor(value / binSize)

                // Clamp to [0, 255]
                quantized = Math.max(0, Math.min(255, Math.round(quantized)))
                // console.log(value, quantized)

                output[i + j] = quantized
            }
            // Preserve alpha channel
            output[i + 3] = input[i + 3]
        }

        // Draw the quantized result
        ctx.putImageData(outputData, 0, 0)
    },
}
