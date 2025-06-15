export const adjustments = {
    defaultParams: {
        brightness: 0, // Range: -1 to 1, where 0 is normal
        contrast: 0, // Range: -1 to 1, where 0 is normal
        saturation: 0, // Range: -1 to 1, where 0 is normal
    },

    render(ctx, { inputCtx, width, height, brightness, contrast, saturation }) {
        if (!inputCtx) return

        // Convert our normalized values (-1 to 1) to CSS filter values
        // Brightness: 0 = normal, -1 = black, 1 = white
        // Contrast: 0 = normal, -1 = gray, 1 = max contrast
        // Saturation: 0 = normal, -1 = grayscale, 1 = max saturation
        const brightnessValue = 1 + brightness
        const contrastValue = 1 + contrast
        const saturationValue = 1 + saturation

        // Apply filters
        ctx.filter = `brightness(${brightnessValue}) contrast(${contrastValue}) saturate(${saturationValue})`

        // Draw the filtered image
        const { width: inputWidth, height: inputHeight } = inputCtx.canvas
        ctx.drawImage(inputCtx.canvas, 0, 0, inputWidth, inputHeight, 0, 0, width, height)

        // Reset filter
        ctx.filter = 'none'
    },
}
