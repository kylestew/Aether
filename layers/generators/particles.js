class SimpleEmitter {
    constructor() {
        this.x = 200
        this.y = 200
        this.direction = Math.PI * -0.5
        this.spread = Math.PI / 8
        this.spawnRate = 100
        this.speed = 100
        this.life = 1.0
    }

    reset() {
        console.log('reset')
        this._particles = []
        this._lastTime = null
    }

    // _accumulator: 0,
    spawn(dt) {
        // Spawn particles
        // this._accumulator += dt * spawnRate
        // while (this._accumulator >= 1) {
        //     const angle = direction + (Math.random() - 0.5) * spread
        //     const vx = Math.cos(angle) * speed
        //     const vy = Math.sin(angle) * speed
        //     this._particles.push({
        //         x,
        //         y,
        //         vx,
        //         vy,
        //         life,
        //         maxLife: life,
        //     })
        //     this._accumulator--
        // }
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
        emitter.spawn(dt) // TODO: need to return the particles

        // Update particles
        this._particles = this._particles.filter((p) => p.life > 0) // kill dead particles
        for (let p of this._particles) {
            p.x += p.vx * dt
            p.y += p.vy * dt

            // TODO: apply a field force, drag, etc.

            p.life -= dt
        }

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

export { particles, SimpleEmitter }
