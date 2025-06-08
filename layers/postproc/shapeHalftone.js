/*
- We render circles in each cell
- For cells with luma above a certain threshold, we render a wide white circle centered in the middle of the cell
- For the rest, a smaller circle centered this time in the bottom left corner of the cell
*/
export const dottedHalftoneEffect = {
    defaultParams: {
        cellSize: 8,
        threshold: 0.7,
        backgroundColor: '#000',
        foregroundColor: '#fff',
    },

    render(ctx, { t, inputCtx, resolution, params }) {
        if (!inputCtx) return

        const { width, height } = resolution

        // Create a temporary canvas for the input
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        tempCanvas.width = width
        tempCanvas.height = height

        // Draw input to temp canvas
        tempCtx.drawImage(inputCtx.canvas, 0, 0)
        const imageData = tempCtx.getImageData(0, 0, width, height)
        const pixels = imageData.data

        // Clear main canvas and set background color (receipt paper color)
        ctx.fillStyle = params.backgroundColor
        ctx.fillRect(0, 0, width, height)

        // calc params
        const cellSize = params.cellSize
        const halfCell = cellSize / 2
        const largeRad = halfCell * 0.6
        const smallRad = halfCell * 0.3
        ctx.fillStyle = params.foregroundColor

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

                // determine size and offset
                let rad, xPos, yPos
                if (avgLuma < params.threshold) {
                    rad = smallRad
                    xPos = x + rad * 2
                    yPos = y + cellSize - rad * 2
                } else {
                    rad = largeRad
                    xPos = x + halfCell
                    yPos = y + halfCell
                }

                // Draw circle
                ctx.beginPath()
                ctx.arc(xPos, yPos, rad, 0, Math.PI * 2)
                ctx.fill()
            }
        }
    },
}
