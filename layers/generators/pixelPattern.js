const pixelPattern = {
    defaultParams: {
        pattern: [
            [0.0, 0.53, 0.13, 0.66],
            [0.8, 0.26, 0.93, 0.4],
            [0.2, 0.73, 0.06, 0.6],
            [1.0, 0.46, 0.86, 0.33],
        ], // 4x4 Bayer matrix normalized to 0–1
        color: '#ffffff',
        scale: 4, // Size of each rendered "pixel"
    },

    _patternCanvas: null,

    _makePatternCanvas(pattern, color, scale) {
        const rows = pattern.length
        const cols = pattern[0].length
        const w = cols * scale
        const h = rows * scale

        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const pctx = canvas.getContext('2d')

        // Parse color to RGB (using a canvas!)
        const tmp = document.createElement('canvas')
        const tmpCtx = tmp.getContext('2d')
        tmp.width = tmp.height = 1
        tmpCtx.fillStyle = color
        tmpCtx.fillRect(0, 0, 1, 1)
        const [baseR, baseG, baseB] = tmpCtx.getImageData(0, 0, 1, 1).data

        // Draw pattern pixels
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const multiplier = Math.max(0, Math.min(1, pattern[y][x]))

                const r = Math.round(baseR * multiplier)
                const g = Math.round(baseG * multiplier)
                const b = Math.round(baseB * multiplier)

                pctx.fillStyle = `rgb(${r}, ${g}, ${b})` // Fully opaque
                pctx.fillRect(x * scale, y * scale, scale, scale)
            }
        }

        return canvas
    },

    render(ctx, { width, height, color, scale, pattern }) {
        this._patternCanvas = this._makePatternCanvas(pattern, color, scale)
        const fillPattern = ctx.createPattern(this._patternCanvas, 'repeat')

        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = fillPattern
        ctx.fillRect(0, 0, width, height)
    },
}

const horizontalDither = [
    [205, 230, 230, 230, 230, 205, 178, 178, 152, 152, 152, 178],
    [64, 32, 32, 32, 32, 64, 96, 126, 126, 126, 96, 96],
    [178, 178, 152, 152, 152, 178, 205, 230, 230, 230, 230, 205],
    [96, 126, 126, 126, 96, 96, 64, 32, 32, 32, 32, 64],
].map((row) => row.map((val) => val / 255))

export { pixelPattern, horizontalDither }
