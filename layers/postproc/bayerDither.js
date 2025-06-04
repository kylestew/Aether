export function renderBayerDither(ctx, { inputCtx, resolution }) {
    if (!inputCtx) return

    const { width, height } = resolution
    ctx.clearRect(0, 0, width, height)

    // 2x2 Bayer matrix (normalized to 0-1 range)
    const bayerMatrix = [
        [0, 2],
        [3, 1],
    ].map((row) => row.map((v) => v / 4))

    const inputData = inputCtx.getImageData(0, 0, width, height).data
    const outputData = ctx.createImageData(width, height)
    const output = outputData.data

    // Dithering parameters - adjusted for more prominent pixels
    const contrast = 2.0 // Increased contrast for more dramatic separation
    const threshold = 0.35 // Lower threshold for more black pixels
    const bayerStrength = 2.5 // Significantly increased bayer pattern strength

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4
            // Amplify the bayer pattern effect
            const bayerValue = (bayerMatrix[y % 2][x % 2] - 0.5) * bayerStrength + 0.5

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
}
