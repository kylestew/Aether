export const asciiDitherLayer = {
    defaultParams: {
        asciiChars: '█▓▒░⌂☺☻♠♣♦♥◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ ',
        cellSize: 16,
        backgroundColor: '#000',
        foregroundColor: '#fff',
    },

    render(ctx, { inputCtx, resolution, params }) {
        if (!inputCtx) return

        const { width, height } = resolution
        const cellSize = params.cellSize

        // Get image data from input
        const imageData = inputCtx.getImageData(0, 0, width, height).data

        // Set up font
        ctx.fillStyle = params.backgroundColor
        ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = params.foregroundColor
        ctx.font = `${cellSize}px monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // For each cell
        for (let y = 0; y < height; y += cellSize) {
            for (let x = 0; x < width; x += cellSize) {
                // Average luma in cell
                let total = 0,
                    count = 0
                for (let dy = 0; dy < cellSize; dy++) {
                    for (let dx = 0; dx < cellSize; dx++) {
                        const px = x + dx,
                            py = y + dy
                        if (px >= width || py >= height) continue
                        const i = (py * width + px) * 4
                        const r = imageData[i],
                            g = imageData[i + 1],
                            b = imageData[i + 2]
                        const luma = 0.299 * r + 0.587 * g + 0.114 * b
                        total += luma / 255
                        count++
                    }
                }
                const avg = total / count

                // Map luma to character
                const charIdx = Math.floor(avg * (params.asciiChars.length - 1))
                const char = params.asciiChars[charIdx]
                ctx.fillText(char, x + cellSize / 2, y + cellSize / 2)
            }
        }
    },
}
