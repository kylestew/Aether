export function createDebugLayer(otherLayers) {
    const history = {}
    const maxHistory = 300 // Frames to keep

    return {
        render(ctx, { t, frame, resolution }) {
            const { width, height } = resolution

            ctx.clearRect(0, 0, width, height)
            ctx.save()
            ctx.globalAlpha = 0.8

            const padding = 10
            const graphHeight = 60
            let yOffset = padding

            for (const layer of otherLayers) {
                const params = layer.currentParams
                if (!params) continue

                for (const [key, value] of Object.entries(params)) {
                    // Initialize history for this param
                    const id = `${layer.renderFn.name || 'anon'}:${key}`
                    if (!history[id]) history[id] = []

                    // Add value to history
                    const val = typeof value === 'number' ? value : 0
                    history[id].push(val)
                    if (history[id].length > maxHistory) history[id].shift()

                    // Draw graph
                    ctx.beginPath()
                    ctx.strokeStyle = '#0ff'
                    ctx.lineWidth = 1
                    const points = history[id]
                    for (let i = 0; i < points.length; i++) {
                        const x = (i / maxHistory) * width
                        const y = yOffset + graphHeight - points[i] * graphHeight // scale y
                        if (i === 0) ctx.moveTo(x, y)
                        else ctx.lineTo(x, y)
                    }
                    ctx.stroke()

                    // Label
                    ctx.fillStyle = '#0ff'
                    ctx.font = '10px monospace'
                    ctx.fillText(id, padding, yOffset - 2)

                    yOffset += graphHeight + padding
                }
            }

            ctx.restore()
        },
    }
}
