export const particleSystemDirectional = {
    defaultParams: {
        x: 200, // spawn x
        y: 200, // spawn y
        direction: Math.PI * -0.5, // angle in radians (upward)
        spread: Math.PI / 8, // cone width
        spawnRate: 100, // particles/sec
        speed: 100, // px/sec
        life: 1.0, // seconds
        size: 2,
        color: '#ffffff',
    },

    _particles: [],
    _accumulator: 0,
    _lastTime: null,

    render(ctx, { t, width, height, x, y, direction, spread, spawnRate, speed, life, size, color }) {
        if (this._lastTime === null) this._lastTime = t
        const dt = t - this._lastTime
        this._lastTime = t

        // Color to RGB
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        tempCanvas.width = 1
        tempCanvas.height = 1
        tempCtx.fillStyle = color
        tempCtx.fillRect(0, 0, 1, 1)
        const [r, g, b] = tempCtx.getImageData(0, 0, 1, 1).data

        // Spawn particles
        this._accumulator += dt * spawnRate
        while (this._accumulator >= 1) {
            const angle = direction + (Math.random() - 0.5) * spread
            const vx = Math.cos(angle) * speed
            const vy = Math.sin(angle) * speed

            this._particles.push({
                x,
                y,
                vx,
                vy,
                life,
                maxLife: life,
            })
            this._accumulator--
        }

        // Update and draw
        this._particles = this._particles.filter((p) => p.life > 0)
        for (let p of this._particles) {
            p.x += p.vx * dt
            p.y += p.vy * dt
            p.life -= dt

            const alpha = Math.max(p.life / p.maxLife, 0)
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`
            ctx.beginPath()
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
            ctx.fill()
        }

        /*
        Draw as spheres?
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`);
gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

ctx.fillStyle = gradient;
ctx.beginPath();
ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
ctx.fill();
*/
    },
}
