export const wigglyLines = {
    label: 'Wiggly Lines',
    defaultParams: {
        lineCount: 10,
        amplitude: (t) => 40 + Math.sin(t) * 20,
    },

    render(ctx, { t, frame, resolution, params }) {
        const { width, height } = resolution
        const { lineCount, amplitude } = params

        ctx.clearRect(0, 0, width, height)
        ctx.strokeStyle = '#00ffff'
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
