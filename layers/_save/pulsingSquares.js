import { pulse, step, osc } from '../../src/paramMacros.js'

export const pulsingSquares = {
    label: 'Pulsing Squares',

    defaultParams: {
        size: pulse(0.5, 0.2, 0.6), // size is relative to canvas width
        color: step(2.0, ['#ff0080', '#00ffff', '#ffffff']),
        rotation: osc(0.3), // subtle wiggle
    },

    render(ctx, { t, frame, resolution, params }) {
        const { width, height } = resolution
        const { size, color, rotation } = params

        const scaledSize = size * width

        ctx.clearRect(0, 0, width, height)

        ctx.save()
        ctx.translate(width / 2, height / 2)
        ctx.rotate(rotation)
        ctx.fillStyle = color
        ctx.fillRect(-scaledSize / 2, -scaledSize / 2, scaledSize, scaledSize)
        ctx.restore()
    },
}
