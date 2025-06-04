export const scanLines = {
    label: 'Scanlines',

    defaultParams: {
        lineCount: 10,
        color: '#00FFF0',
        amplitude: (t) => 40 + Math.sin(t) * 20,
    },

    render(ctx, { t, resolution, params }) {
        const { width, height } = resolution
        const { lineCount, color, amplitude } = params

        ctx.clearRect(0, 0, width, height)
        ctx.strokeStyle = color
        ctx.lineWidth = 2

        for (let i = 0; i < lineCount; i++) {
            const xBase = (i + 0.5) * (width / lineCount)
            const x = xBase + Math.sin(t * 2 + i) * amplitude
            ctx.beginPath()
            ctx.moveTo(x, 0)
            ctx.lineTo(x, height)
            ctx.stroke()
        }
    },
}
