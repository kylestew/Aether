export const pixelate = {
    defaultParams: {
        pixelSize: 16,
    },

    render(ctx, { inputCtx, width, height, pixelSize }) {
        if (!inputCtx) return

        const pxSize = Math.floor(pixelSize)

        // Create a temporary canvas for downscaling
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')

        // Set temp canvas to the downscaled size
        const downscaledWidth = Math.floor(width / pxSize)
        const downscaledHeight = Math.floor(height / pxSize)
        tempCanvas.width = downscaledWidth
        tempCanvas.height = downscaledHeight

        // Draw input at downscaled size
        tempCtx.drawImage(inputCtx.canvas, 0, 0, downscaledWidth, downscaledHeight)

        // Clear main canvas and draw the pixelated version
        ctx.clearRect(0, 0, width, height)
        ctx.imageSmoothingEnabled = false // Disable smoothing for crisp pixels
        ctx.drawImage(tempCanvas, 0, 0, width, height)
    },
}

/*
vec2 normalizedPixelSize = pixelSize / resolution;
vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);

vec4 color = texture2D(inputBuffer, uvPixel);
*/
