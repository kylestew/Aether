export function renderLayer2(ctx, { inputCtx, resolution }) {
    if (!inputCtx) return

    const { width, height } = resolution
    ctx.clearRect(0, 0, width, height)

    const inputData = inputCtx.getImageData(0, 0, width, height).data
    const step = 10

    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
            const i = (y * width + x) * 4
            const brightness = inputData[i] / 255
            ctx.fillStyle = `rgba(100, 200, 255, ${brightness})`
            ctx.fillRect(x, y, step, step)
        }
    }
}
