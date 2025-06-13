export const waves = {
    defaultParams: {
        frequency: 10,
        amplitude: 20,
        count: 20,
        lineWidth: 10,
        color: '#ffffff',
        background: '#000000',
    },

    render(ctx, { width, height, count, lineWidth, color, background, frequency, amplitude }) {
        // Fill background with black
        ctx.fillStyle = background
        ctx.fillRect(0, 0, width, height)

        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth

        // Calculate spacing between lines
        const spacing = height / (count + 1)

        // Draw each line as a sine wave with segments
        const segments = width
        // / 10
        const segmentWidth = width / segments

        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        for (let i = 1; i <= count; i++) {
            const baseY = spacing * i

            // Start path at beginning of line
            ctx.beginPath()
            ctx.moveTo(0, baseY + Math.sin(0) * amplitude)

            // Draw continuous path across width
            for (let x = 0; x <= width; x += segmentWidth) {
                const y = baseY + Math.sin((x / width) * Math.PI * 2 * frequency) * amplitude
                ctx.lineTo(x, y)
            }

            ctx.stroke()
        }
    },
}
