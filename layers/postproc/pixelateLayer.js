export const pixelateLayer = {
    defaultParams: {
        pixelSize: 16,
    },

    render(ctx, { inputCtx, resolution, params }) {
        if (!inputCtx) return

        const { width, height } = resolution

        const pixelSize = Math.floor(params.pixelSize)

        // Create a temporary canvas for downscaling
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')

        // Set temp canvas to the downscaled size
        const downscaledWidth = Math.floor(width / pixelSize)
        const downscaledHeight = Math.floor(height / pixelSize)
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
