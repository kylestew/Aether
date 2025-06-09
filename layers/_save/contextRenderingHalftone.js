/*
- Convert input image to cells and average each cell to a luma value
- Map luma ranges to rendering code
*/
export const contextRenderingHalftone = {
    defaultParams: {
        cellSize: 16,
        backgroundColor: '#fff',
        foregroundColor: '#0050ee', // Bright blue color
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

        // Clear main canvas and set background color
        ctx.fillStyle = params.backgroundColor
        ctx.fillRect(0, 0, width, height)

        // calc params
        const cellSize = params.cellSize
        // const halfCell = cellSize / 2
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

                // Draw square scaled by luminance
                const squareSize = cellSize * avgLuma
                const xPos = x + (cellSize - squareSize) / 2
                const yPos = y + (cellSize - squareSize) / 2

                ctx.fillRect(xPos, yPos, squareSize, squareSize)
            }
        }
    },
}
