export function renderRotatingPlus(ctx, { t, frame, resolution, totalTime }) {
    const { width, height } = resolution

    // Calculate rotation angle (one full rotation over total time)
    const rotation = (t / totalTime) * Math.PI * 2

    // Plus sign dimensions
    const size = 360
    const thickness = 64

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = 'white'

    // Save context state, translate to center, rotate, then draw plus
    ctx.save()
    ctx.translate(width / 2, height / 2)
    ctx.rotate(rotation)

    // Draw horizontal line of plus
    ctx.fillRect(-size / 2, -thickness / 2, size, thickness)
    // Draw vertical line of plus
    ctx.fillRect(-thickness / 2, -size / 2, thickness, size)

    ctx.restore()
}
