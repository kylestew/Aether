const patterns = {
    test_3: [
        [0 / 7, 1 / 7, 2 / 7],
        [3 / 7, 4 / 7, 5 / 7],
        [6 / 7, 7 / 7, 8 / 7],
    ],
    test: [
        [0 / 15, 1 / 15, 2 / 15, 3 / 15],
        [4 / 15, 5 / 15, 6 / 15, 7 / 15],
        [8 / 15, 9 / 15, 10 / 15, 11 / 15],
        [12 / 15, 13 / 15, 14 / 15, 15 / 15],
    ],
    bayer: [
        [0.0, 0.53, 0.13, 0.66],
        [0.8, 0.26, 0.93, 0.4],
        [0.2, 0.73, 0.06, 0.6],
        [1.0, 0.46, 0.86, 0.33],
    ], // 4x4 Bayer matrix normalized to 0–1
    // bayer 8x8
    clustered_dot: [
        [6 / 9, 8 / 9, 4 / 9],
        [1 / 9, 0 / 9, 3 / 9],
        [5 / 9, 2 / 9, 7 / 9],
    ],
    diagonal_dither: [
        [0 / 16, 8 / 16, 2 / 16, 10 / 16],
        [12 / 16, 4 / 16, 14 / 16, 6 / 16],
        [3 / 16, 11 / 16, 1 / 16, 9 / 16],
        [15 / 16, 7 / 16, 13 / 16, 5 / 16],
    ],
    spiral_dot_dither: [
        [5 / 16, 6 / 16, 7 / 16, 12 / 16],
        [4 / 16, 1 / 16, 8 / 16, 13 / 16],
        [3 / 16, 2 / 16, 9 / 16, 14 / 16],
        [0 / 16, 15 / 16, 10 / 16, 11 / 16],
    ],
    line_dither: [
        [0 / 15, 1 / 15, 2 / 15, 3 / 15],
        [4 / 15, 5 / 15, 6 / 15, 7 / 15],
        [8 / 15, 9 / 15, 10 / 15, 11 / 15],
        [12 / 15, 13 / 15, 14 / 15, 15 / 15],
    ],
    beehive: [
        [0 / 35, 32 / 35, 8 / 35, 40 / 35, 16 / 35, 48 / 35],
        [24 / 35, 56 / 35, 4 / 35, 36 / 35, 12 / 35, 44 / 35],
        [2 / 35, 34 / 35, 10 / 35, 42 / 35, 18 / 35, 50 / 35],
        [26 / 35, 58 / 35, 6 / 35, 38 / 35, 14 / 35, 46 / 35],
        [1 / 35, 33 / 35, 9 / 35, 41 / 35, 17 / 35, 49 / 35],
        [25 / 35, 57 / 35, 5 / 35, 37 / 35, 13 / 35, 45 / 35],
    ],
    crosses: [
        [0.9, 0.3, 0.7],
        [0.1, 0.5, 0.2],
        [0.6, 0.3, 0.8],
    ],
    // TODO: gen blue noise
}

// const horizontalDither = [
//     [205, 230, 230, 230, 230, 205, 178, 178, 152, 152, 152, 178],
//     [64, 32, 32, 32, 32, 64, 96, 126, 126, 126, 96, 96],
//     [178, 178, 152, 152, 152, 178, 205, 230, 230, 230, 230, 205],
//     [96, 126, 126, 126, 96, 96, 64, 32, 32, 32, 32, 64],
// ].map((row) => row.map((val) => val / 255))

const pixelPattern = {
    defaultParams: {
        pattern: 'bayer',
        color: '#ffffff',
        scale: 4, // Size of each rendered "pixel"
    },

    _patternCanvas: null,

    _makePatternCanvas(pattern, color, scale) {
        const grid = patterns[pattern]
        const rows = grid.length
        const cols = grid[0].length
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
                const multiplier = Math.max(0, Math.min(1, grid[y][x]))

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

export { pixelPattern }
