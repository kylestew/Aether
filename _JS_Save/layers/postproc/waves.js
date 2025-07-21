export const waves = {
    defaultParams: {
        frequency: 40,
        amplitude: 14,
        count: 64,
        lineWidth: 4,
        color: '#ffffff',
        background: '#000000',
        smoothness: 5, // Number of previous values to average
    },

    // Helper to get smoothed luminance value
    _getSmoothedLuminance(ctx, x, y, smoothness) {
        let totalLuminance = 0
        const samples = Math.max(1, smoothness)

        // Sample points around the target position
        for (let i = -samples; i <= samples; i++) {
            const pixel = ctx.getImageData(x + i, y, 1, 1).data
            const luminance = (pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114) / 255
            totalLuminance += luminance
        }

        return totalLuminance / (samples * 2 + 1)
    },

    render(ctx, { inputCtx, width, height, count, lineWidth, color, background, frequency, amplitude, smoothness }) {
        if (!inputCtx) return

        // Fill background with black
        ctx.fillStyle = background
        ctx.fillRect(0, 0, width, height)

        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth

        // Calculate spacing between lines
        const spacing = height / (count + 1)

        // Draw each line as a sine wave with segments
        const segments = width / 2
        const segmentWidth = width / segments

        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // Create a temporary canvas to sample from input
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        tempCanvas.width = width
        tempCanvas.height = height
        tempCtx.drawImage(inputCtx.canvas, 0, 0, width, height)

        for (let i = 1; i <= count; i++) {
            const baseY = spacing * i
            const offset = (i - 1) * (Math.PI / 2)

            // Start path at beginning of line
            ctx.beginPath()
            // Start offscreen to the left to let moving average stabilize
            ctx.moveTo(-segmentWidth * smoothness, baseY + Math.sin(offset) * amplitude)

            // Initialize moving average buffer with zeros
            const buffer = new Array(smoothness).fill(0)
            let bufferIndex = 0
            let sum = 0

            // Draw continuous path across width, including offscreen start
            for (let x = -segmentWidth * smoothness; x <= width; x += segmentWidth) {
                if (x >= 0) {
                    const pixel = tempCtx.getImageData(x, baseY, 1, 1).data
                    const currentLuminance = (pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114) / 255

                    // Update moving average
                    sum = sum - buffer[bufferIndex] + currentLuminance
                    buffer[bufferIndex] = currentLuminance
                    bufferIndex = (bufferIndex + 1) % smoothness
                }

                // Calculate average luminance
                const avgLuminance = sum / smoothness

                // Modulate amplitude by smoothed luminance
                const modifiedAmplitude = amplitude * avgLuminance

                const y = baseY + Math.sin((x / width) * Math.PI * 2 * frequency + offset) * modifiedAmplitude
                ctx.lineTo(x, y)
            }

            ctx.stroke()
        }
    },
}
