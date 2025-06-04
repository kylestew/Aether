import { pulse, step, osc } from '../paramUtils.js'

export const pulsingSquares = {
    label: 'Pulsing Squares',
    defaultParams: {
        size: pulse(1.5, 20, 80), // pulse between 20–80px
        color: step(0.5, ['#ff0080', '#00ffff', '#ffffff']),
        rotation: osc(0.2), // subtle wiggle
    },

    render(ctx, { t, frame, resolution, params }) {
        const { width, height } = resolution
        const { size, color, rotation } = params

        ctx.clearRect(0, 0, width, height)

        ctx.save()
        ctx.translate(width / 2, height / 2)
        ctx.rotate(rotation)
        ctx.fillStyle = color
        ctx.fillRect(-size / 2, -size / 2, size, size)
        ctx.restore()
    },
}
