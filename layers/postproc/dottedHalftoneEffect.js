/*
https://blog.maximeheckel.com/posts/post-processing-as-a-creative-medium/#:~:text=we%20want%20(foreshadowing%20%F0%9F%91%80)-,Shaping%20pixels,-We%20could%20leave

Sort of like a dithered effect.

- Each cell is composed of horizontal black bars.
- The darker the area, the longer the bar.
- The lighter the area, the shorter the bar (or no bar).

We render circles in each cell
For cells with luma above a certain threshold, we render a wide white circle centered in the middle of the cell
For the rest, a smaller circle centered this time in the bottom left corner of the cell

*/
export const dottedHalftoneEffect = {
    defaultParams: {
        pixelSize: 8,
        backgroundColor: '#fff',
        foregroundColor: '#000',
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

        // Process each cell
        const pixelSize = params.pixelSize
        for (let y = 0; y < height; y += pixelSize) {
            for (let x = 0; x < width; x += pixelSize) {
                // Calculate average luma for this cell
                let totalLuma = 0
                let sampleCount = 0

                // Sum pixels in this cell and average them
                for (let py = 0; py < pixelSize && y + py < height; py++) {
                    for (let px = 0; px < pixelSize && x + px < width; px++) {
                        const i = ((y + py) * width + (x + px)) * 4
                        const luma = pixels[i] * 0.2126 + pixels[i + 1] * 0.7152 + pixels[i + 2] * 0.0722
                        totalLuma += luma / 255
                        sampleCount++
                    }
                }
                const avgLuma = totalLuma / sampleCount

                // Determine line width based on luma (matching shader thresholds)
                let lineWidth = 0
                if (avgLuma > 0.99) lineWidth = 0
                else if (avgLuma > 0.9) lineWidth = 0.1
                else if (avgLuma > 0.7) lineWidth = 0.3
                else if (avgLuma > 0.5) lineWidth = 0.5
                else if (avgLuma > 0.3) lineWidth = 0.7
                else if (avgLuma > 0.0) lineWidth = 1.0

                // Draw the line if needed
                if (lineWidth > 0) {
                    const cellWidth = pixelSize * lineWidth
                    const yStart = pixelSize * 0.05
                    const yEnd = pixelSize * 0.95

                    ctx.fillStyle = params.foregroundColor
                    ctx.fillRect(x, y + yStart, cellWidth, yEnd - yStart)
                }
            }
        }
    },
}
