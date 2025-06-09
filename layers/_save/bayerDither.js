/**
 * Generates a Bayer matrix for the given level
 * @param {number} n - The exponent n that determines matrix size (2^n x 2^n)
 * @returns {number[][]} The Bayer matrix
 */
function generateBayerMatrix(n) {
    if (n === 1) {
        return [
            [0, 2],
            [3, 1],
        ]
    }

    const prev = generateBayerMatrix(n - 1)
    const size = prev.length
    const newSize = size * 2
    const matrix = Array.from({ length: newSize }, () => Array(newSize).fill(0))

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const val = prev[y][x]
            matrix[y][x] = 4 * val
            matrix[y][x + size] = 4 * val + 2
            matrix[y + size][x] = 4 * val + 3
            matrix[y + size][x + size] = 4 * val + 1
        }
    }

    return matrix
}

export const bayerDither = {
    defaultParams: {
        order: 3,
        contrast: 1.5, // Increased contrast for more dramatic separation
        threshold: 0.5, // Lower threshold for more black pixels
        bayerStrength: 2.0,
    },

    init(params) {
        // create the static bayer matrix - bounded
        const order = Math.min(Math.max(Math.floor(params.order ?? 2), 1), 5)
        const n = Math.pow(2, order)
        const size = n * n
        // pre-normalize
        this.bayerMatrix = generateBayerMatrix(order).map((row) => row.map((v) => v / (size - 1)))
    },

    render(ctx, { inputCtx, resolution, params }) {
        if (!inputCtx) return

        const { width, height } = resolution
        ctx.clearRect(0, 0, width, height)

        const inputData = inputCtx.getImageData(0, 0, width, height).data
        const outputData = ctx.createImageData(width, height)
        const output = outputData.data
        const matrixSize = this.bayerMatrix.length

        // Dithering parameters - adjusted for more prominent pixels
        const { contrast, threshold, bayerStrength } = params

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4

                // Amplify the bayer pattern effect
                const bayerValue = (this.bayerMatrix[y % matrixSize][x % matrixSize] - 0.5) * bayerStrength + 0.5

                // Get input pixel values and apply stronger contrast
                const r = Math.max(0, Math.min(255, ((inputData[i] / 255 - 0.5) * contrast + 0.5) * 255))
                const g = Math.max(0, Math.min(255, ((inputData[i + 1] / 255 - 0.5) * contrast + 0.5) * 255))
                const b = Math.max(0, Math.min(255, ((inputData[i + 2] / 255 - 0.5) * contrast + 0.5) * 255))

                // Apply dithering with more extreme threshold
                const thresholdValue = threshold * 255
                output[i] = r + bayerValue * 255 > thresholdValue ? 255 : 0
                output[i + 1] = g + bayerValue * 255 > thresholdValue ? 255 : 0
                output[i + 2] = b + bayerValue * 255 > thresholdValue ? 255 : 0
                output[i + 3] = 255
            }
        }

        ctx.putImageData(outputData, 0, 0)
    },
}
