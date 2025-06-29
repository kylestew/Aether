export const shapeDither = {
    defaultParams: {
        cellSize: 8,
        backgroundColor: '#fff',
        foregroundColor: '#0050ee', // Bright blue color

        shapes: [
            {
                threshold: 0.25,
                renderFn: (ctx, cellSize, fg, bg) => {
                    // filled square
                    ctx.fillStyle = fg
                    ctx.fillRect(0, 0, cellSize, cellSize)
                },
            },
            {
                threshold: 0.5,
                renderFn: (ctx, cellSize, fg, bg) => {
                    // Draw circle inverted in square
                    ctx.fillStyle = fg
                    ctx.fillRect(0, 0, cellSize, cellSize)

                    ctx.fillStyle = bg
                    ctx.beginPath()
                    const rad = cellSize / 3
                    ctx.arc(cellSize / 2, cellSize / 2, rad, 0, Math.PI * 2)
                    ctx.fill()
                },
            },
            {
                threshold: 0.8,
                renderFn: (ctx, cellSize, fg, bg) => {
                    // Draw circle
                    ctx.fillStyle = fg
                    ctx.beginPath()
                    const rad = cellSize / 3
                    ctx.arc(cellSize / 2, cellSize / 2, rad, 0, Math.PI * 2)
                    ctx.fill()
                },
            },
            {
                threshold: 0.95,
                renderFn: () => {
                    // do nothing
                },
            },
        ],
    },

    render(ctx, { t, inputCtx, width, height, cellSize, shapes, backgroundColor, foregroundColor }) {
        if (!inputCtx) return
        const imageData = inputCtx.getImageData(0, 0, width, height)
        const pixels = imageData.data

        // Clear main canvas and set background color
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, width, height)

        // calc params
        const halfCell = cellSize / 2
        const largeRad = halfCell * 0.6
        const smallRad = halfCell * 0.3
        ctx.fillStyle = foregroundColor

        // Process each cell
        for (let y = 0; y < height; y += cellSize) {
            for (let x = 0; x < width; x += cellSize) {
                // Calculate average luma for this cell
                let totalLuma = 0
                let sampleCount = 0
                for (let py = 0; py < cellSize && y + py < height; py++) {
                    for (let px = 0; px < cellSize && x + px < width; px++) {
                        const i = ((y + py) * width + (x + px)) * 4
                        const luma = pixels[i] * 0.2126 + pixels[i + 1] * 0.7152 + pixels[i + 2] * 0.0722
                        totalLuma += luma / 255
                        sampleCount++
                    }
                }
                const avgLuma = totalLuma / sampleCount

                const renderFn = shapes.find((shape) => avgLuma <= shape.threshold)?.renderFn
                if (renderFn) {
                    ctx.save()
                    ctx.translate(x, y)
                    renderFn(ctx, cellSize, foregroundColor, backgroundColor)
                    ctx.restore()
                }
            }
        }
    },
}
