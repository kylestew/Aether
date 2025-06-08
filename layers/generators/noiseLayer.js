// Simplex noise implementation
// Based on https://github.com/jwagner/simplex-noise.js
function createSimplexNoise() {
    const p = new Uint8Array(256)
    for (let i = 0; i < 256; i++) p[i] = i

    let n
    for (let i = 255; i > 0; i--) {
        n = Math.floor((i + 1) * Math.random())
        const q = p[i]
        p[i] = p[n]
        p[n] = q
    }

    const perm = new Uint8Array(512)
    const permMod12 = new Uint8Array(512)
    for (let i = 0; i < 512; i++) {
        perm[i] = p[i & 255]
        permMod12[i] = perm[i] % 12
    }

    const grad3 = new Float32Array([
        1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0,
        -1, -1,
    ])

    function dot(g, x, y, z) {
        return g[0] * x + g[1] * y + g[2] * z
    }

    function noise(xin, yin, zin) {
        let n0, n1, n2, n3

        const F3 = 1 / 3
        const G3 = 1 / 6

        const s = (xin + yin + zin) * F3
        const i = Math.floor(xin + s)
        const j = Math.floor(yin + s)
        const k = Math.floor(zin + s)

        const t = (i + j + k) * G3
        const X0 = i - t
        const Y0 = j - t
        const Z0 = k - t
        const x0 = xin - X0
        const y0 = yin - Y0
        const z0 = zin - Z0

        let i1, j1, k1
        let i2, j2, k2

        if (x0 >= y0) {
            if (y0 >= z0) {
                i1 = 1
                j1 = 0
                k1 = 0
                i2 = 1
                j2 = 1
                k2 = 0
            } else if (x0 >= z0) {
                i1 = 1
                j1 = 0
                k1 = 0
                i2 = 1
                j2 = 0
                k2 = 1
            } else {
                i1 = 0
                j1 = 0
                k1 = 1
                i2 = 1
                j2 = 0
                k2 = 1
            }
        } else {
            if (y0 < z0) {
                i1 = 0
                j1 = 0
                k1 = 1
                i2 = 0
                j2 = 1
                k2 = 1
            } else if (x0 < z0) {
                i1 = 0
                j1 = 1
                k1 = 0
                i2 = 0
                j2 = 1
                k2 = 1
            } else {
                i1 = 0
                j1 = 1
                k1 = 0
                i2 = 1
                j2 = 1
                k2 = 0
            }
        }

        const x1 = x0 - i1 + G3
        const y1 = y0 - j1 + G3
        const z1 = z0 - k1 + G3
        const x2 = x0 - i2 + 2 * G3
        const y2 = y0 - j2 + 2 * G3
        const z2 = z0 - k2 + 2 * G3
        const x3 = x0 - 1 + 3 * G3
        const y3 = y0 - 1 + 3 * G3
        const z3 = z0 - 1 + 3 * G3

        const ii = i & 255
        const jj = j & 255
        const kk = k & 255

        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0
        if (t0 < 0) n0 = 0
        else {
            const gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3
            t0 *= t0
            n0 = t0 * t0 * dot(grad3, x0, y0, z0)
        }

        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1
        if (t1 < 0) n1 = 0
        else {
            const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3
            t1 *= t1
            n1 = t1 * t1 * dot(grad3, x1, y1, z1)
        }

        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2
        if (t2 < 0) n2 = 0
        else {
            const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3
            t2 *= t2
            n2 = t2 * t2 * dot(grad3, x2, y2, z2)
        }

        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3
        if (t3 < 0) n3 = 0
        else {
            const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3
            t3 *= t3
            n3 = t3 * t3 * dot(grad3, x3, y3, z3)
        }

        return 32 * (n0 + n1 + n2 + n3)
    }

    return noise
}

// Perlin noise implementation (2D, with time as z)
function createPerlinNoise() {
    const permutation = []
    for (let i = 0; i < 256; i++) permutation[i] = i
    for (let i = 255; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const tmp = permutation[i]
        permutation[i] = permutation[j]
        permutation[j] = tmp
    }
    for (let i = 0; i < 256; i++) permutation[256 + i] = permutation[i]

    function fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10)
    }
    function lerp(a, b, t) {
        return a + t * (b - a)
    }
    function grad(hash, x, y, z) {
        const h = hash & 15
        const u = h < 8 ? x : y
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
    }
    function noise(x, y, z) {
        const X = Math.floor(x) & 255
        const Y = Math.floor(y) & 255
        const Z = Math.floor(z) & 255
        x -= Math.floor(x)
        y -= Math.floor(y)
        z -= Math.floor(z)
        const u = fade(x)
        const v = fade(y)
        const w = fade(z)
        const A = permutation[X] + Y
        const AA = permutation[A] + Z
        const AB = permutation[A + 1] + Z
        const B = permutation[X + 1] + Y
        const BA = permutation[B] + Z
        const BB = permutation[B + 1] + Z
        return lerp(
            lerp(
                lerp(grad(permutation[AA], x, y, z), grad(permutation[BA], x - 1, y, z), u),
                lerp(grad(permutation[AB], x, y - 1, z), grad(permutation[BB], x - 1, y - 1, z), u),
                v
            ),
            lerp(
                lerp(grad(permutation[AA + 1], x, y, z - 1), grad(permutation[BA + 1], x - 1, y, z - 1), u),
                lerp(grad(permutation[AB + 1], x, y - 1, z - 1), grad(permutation[BB + 1], x - 1, y - 1, z - 1), u),
                v
            ),
            w
        )
    }
    return noise
}

export const noiseLayer = {
    defaultParams: {
        scale: 0.02,
        octaves: 4,
        persistence: 0.5,
        lacunarity: 2.0,
        timeScale: 0.1,
        colorize: false,
        color1: '#000000',
        color2: '#ffffff',
        usePerlin: true, // Toggle between Perlin and Simplex
        offsetX: 0, // Can be a function or number
        offsetY: 0, // Can be a function or number
        offsetZ: 0, // Can be a function or number - independent of time
    },

    async init(params) {
        this.simplex = createSimplexNoise()
        this.perlin = createPerlinNoise()
        this.params = { ...this.defaultParams, ...params }
    },

    _parseColor(color) {
        const hex = color.replace('#', '')
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16),
        }
    },

    render(ctx, { resolution, t, params = {} }) {
        const { width, height } = resolution
        const {
            scale,
            octaves,
            persistence,
            lacunarity,
            timeScale,
            colorize,
            color1,
            color2,
            usePerlin,
            offsetX,
            offsetY,
            offsetZ,
        } = {
            ...this.params,
            ...params,
        }

        const imageData = ctx.createImageData(width, height)
        const data = imageData.data

        let color1RGB, color2RGB
        if (colorize) {
            color1RGB = this._parseColor(color1)
            color2RGB = this._parseColor(color2)
        }

        // Get current offset values (handle both functions and numbers)
        const currentOffsetX = typeof offsetX === 'function' ? offsetX(t) : offsetX
        const currentOffsetY = typeof offsetY === 'function' ? offsetY(t) : offsetY
        const currentOffsetZ = typeof offsetZ === 'function' ? offsetZ(t) : offsetZ

        // Generate noise for each pixel
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let amplitude = 1
                let frequency = scale
                let noiseValue = 0
                let maxValue = 0

                for (let i = 0; i < octaves; i++) {
                    const nx = (x + currentOffsetX) * frequency
                    const ny = (y + currentOffsetY) * frequency
                    const nz = (t * timeScale + currentOffsetZ) * frequency
                    const n = usePerlin ? this.perlin(nx, ny, nz) : this.simplex(nx, ny, nz)
                    noiseValue += n * amplitude
                    maxValue += amplitude
                    amplitude *= persistence
                    frequency *= lacunarity
                }

                noiseValue = (noiseValue / maxValue + 1) * 0.5

                const i = (y * width + x) * 4

                if (colorize) {
                    data[i] = Math.round(color1RGB.r + (color2RGB.r - color1RGB.r) * noiseValue)
                    data[i + 1] = Math.round(color1RGB.g + (color2RGB.g - color1RGB.g) * noiseValue)
                    data[i + 2] = Math.round(color1RGB.b + (color2RGB.b - color1RGB.b) * noiseValue)
                } else {
                    const value = Math.round(noiseValue * 255)
                    data[i] = value
                    data[i + 1] = value
                    data[i + 2] = value
                }
                data[i + 3] = 255
            }
        }

        ctx.putImageData(imageData, 0, 0)
    },
}
