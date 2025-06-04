export function renderPixelateLayer(ctx, { inputCtx, resolution, t }) {
    if (!inputCtx) return

    const { width, height } = resolution

    // Animate pixel size between 4 and 16 pixels
    const minPixelSize = 4
    const maxPixelSize = 16
    const pixelSize = Math.floor(minPixelSize + (maxPixelSize - minPixelSize) * Math.sin(t * Math.PI * 0.2))

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
}

/*
vec2 normalizedPixelSize = pixelSize / resolution;
vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);

vec4 color = texture2D(inputBuffer, uvPixel);
*/
