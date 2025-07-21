class SimpleEmitter {
    constructor({ x, y, direction, spread, spawnRate, speed, life } = {}) {
        this.x = x || 200
        this.y = y || 200
        this.direction = direction || Math.PI * -0.5
        this.spread = spread || Math.PI / 8
        this.spawnRate = spawnRate || 100
        this.speed = speed || 100
        this.life = life || 1.0

        this._accumulator = 0
    }

    reset() {
        this._particles = []
        this._lastTime = null
    }

    spawn(dt) {
        // Spawn particles
        this._accumulator += dt * this.spawnRate // float
        let particles = []
        while (this._accumulator >= 1) {
            const angle = this.direction + (Math.random() - 0.5) * this.spread
            const vx = Math.cos(angle) * this.speed
            const vy = Math.sin(angle) * this.speed

            particles.push({
                x: this.x,
                y: this.y,
                vx,
                vy,
                life: this.life,
                maxLife: this.life,
            })
            this._accumulator--
        }
        return particles
    }
}

class ScatterOnceEmitter {
    constructor({ width, height, density } = {}) {
        this.width = width || 800
        this.height = height || 600
        this.density = density || 0.1 // particles per pixel
        this._hasRun = false
    }

    reset() {
        this._hasRun = false
    }

    spawn(dt) {
        if (this._hasRun) return []
        this._hasRun = true

        const particles = []
        const totalParticles = Math.floor(this.width * this.height * this.density)

        // Fail if density would create too many particles
        if (totalParticles > 100000) {
            throw new Error(
                `Density ${this.density} would create ${totalParticles} particles. Maximum allowed is 100,000.`
            )
        }

        // Calculate grid size to ensure even distribution
        const gridSize = Math.sqrt((this.width * this.height) / totalParticles)
        const cols = Math.ceil(this.width / gridSize)
        const rows = Math.ceil(this.height / gridSize)

        // Add some randomness to prevent perfect grid
        const jitter = gridSize * 0.3

        for (let i = 0; i < totalParticles; i++) {
            const col = i % cols
            const row = Math.floor(i / cols)

            // Base position on grid
            let x = col * gridSize
            let y = row * gridSize

            // Add jitter
            x += (Math.random() - 0.5) * jitter
            y += (Math.random() - 0.5) * jitter

            // Ensure particles stay within bounds
            x = Math.max(0, Math.min(this.width, x))
            y = Math.max(0, Math.min(this.height, y))

            particles.push({
                x,
                y,
                vx: 0,
                vy: 0,
                life: Infinity,
                maxLife: Infinity,
            })
        }

        return particles
    }
}

const particles = {
    defaultParams: {
        size: 4,
        color: '#ffffff',
        emitter: new SimpleEmitter(),
    },

    _particles: [],
    _lastTime: null,

    reset(params) {
        this._particles = []
        this._lastTime = null
        params.emitter.reset()
    },

    render(ctx, { t, size, color, emitter }) {
        const dt = t - this._lastTime
        this._lastTime = t

        // Emit particles
        this._particles.push(...emitter.spawn(dt))

        // Update particles
        // this._particles = this._particles.filter((p) => p.life > 0) // kill dead particles
        // for (let p of this._particles) {
        //     p.x += p.vx * dt
        //     p.y += p.vy * dt

        //     // TODO: apply a field force, drag, etc.

        //     p.life -= dt
        // }

        // Draw particles
        for (let p of this._particles) {
            const alpha = Math.max(p.life / p.maxLife, 0)
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
            ctx.fill()
        }
    },
}

export { particles, SimpleEmitter, ScatterOnceEmitter }
