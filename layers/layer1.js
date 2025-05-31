export function renderLayer1(ctx, { t, frame, resolution }) {
    const { width, height } = resolution

    const x = 100 + Math.sin(t * 2) * 80
    const radius = 30 + Math.sin(t * 3) * 10

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(x, height / 2, radius, 0, Math.PI * 2)
    ctx.fill()
}
