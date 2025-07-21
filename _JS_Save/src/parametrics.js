const osc =
    (freq = 1, amplitude = 1, offset = 0) =>
    (pct) =>
        Math.sin(pct * freq * Math.PI * 2) * amplitude + offset

const tri =
    (freq = 1, min = 0, max = 1) =>
    (pct) => {
        const phase = (pct * freq) % 1
        const val = phase < 0.5 ? phase * 2 : 2 - phase * 2
        return min + val * (max - min)
    }

const saw =
    (freq = 1, min = 0, max = 1) =>
    (pct) => {
        const phase = (pct * freq) % 1
        return min + phase * (max - min)
    }

export { osc, tri, saw }

// ─────────────────────────────
// 🎯 POSITION ANIMATORS
// ─────────────────────────────
const none = () => (pct) => [0, 0, 0]

const hover =
    (speed = 2, amplitude = 0.4) =>
    (pct) =>
        [0, Math.sin(pct * Math.PI * 2 * speed) * amplitude, 0]

const orbit =
    (speed = 1, radius = 1.5) =>
    (pct) => {
        const angle = pct * Math.PI * 2 * speed
        return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius]
    }

const bobAndWeave =
    (speed = 1, xAmplitude = 0.5, yAmplitude = 0.3) =>
    (pct) => {
        const a = pct * Math.PI * 2 * speed
        return [Math.sin(a) * xAmplitude, Math.sin(a * 2) * yAmplitude, 0]
    }

const spiralRise =
    (speed = 1, radius = 0.5, height = 2) =>
    (pct) => {
        const angle = pct * Math.PI * 2 * speed
        return [Math.cos(angle) * radius, pct * height - height / 2, Math.sin(angle) * radius]
    }

const sway =
    (speed = 1, amplitude = 0.6) =>
    (pct) =>
        [Math.sin(pct * Math.PI * 2 * speed) * amplitude, 0, 0]

const figure8 =
    (speed = 1, scale = 1) =>
    (pct) => {
        const angle = pct * Math.PI * 2 * speed
        return [Math.sin(angle) * scale, 0, Math.sin(angle * 2) * scale * 0.5]
    }

const zigzag =
    (speed = 1, amplitude = 0.8) =>
    (pct) => {
        const x = pct * 4 - 2
        const z = Math.sin(pct * Math.PI * 8 * speed) * amplitude
        return [x, 0, z]
    }

const bounce =
    (speed = 2, height = 1) =>
    (pct) => {
        const y = Math.abs(Math.sin(pct * Math.PI * 2 * speed)) * height
        return [0, y, 0]
    }

const wave =
    (speed = 1, amplitude = 0.5, frequency = 2) =>
    (pct) => {
        const x = pct * 4 - 2
        const y = Math.sin(pct * Math.PI * 2 * speed * frequency) * amplitude
        return [x, y, 0]
    }

export { none, hover, orbit, bobAndWeave, spiralRise, sway, figure8, zigzag, bounce, wave }

// ─────────────────────────────
// 🎯 ROTATION ANIMATORS
// ─────────────────────────────
const spin =
    (speed = 1) =>
    (pct) =>
        [0, pct * Math.PI * 2 * speed, 0]

const tumble =
    (speed = 1) =>
    (pct) => {
        const angle = pct * Math.PI * 2 * speed
        return [angle, angle * 0.5, angle * 0.2]
    }

const wobble =
    (speed = 1) =>
    (pct) => {
        const a = Math.sin(pct * Math.PI * 2 * speed)
        return [a * 0.3, a * 0.2, Math.cos(pct * Math.PI * 2 * speed) * 0.3]
    }

const twistSpin =
    (speed = 1) =>
    (pct) => {
        const a = pct * Math.PI * 2 * speed
        return [Math.sin(a) * 0.5, a, Math.cos(a) * 0.5]
    }

const flip =
    (speed = 1) =>
    (pct) => {
        const angle = pct * Math.PI * 2 * speed
        return [angle, 0, 0]
    }

const roll =
    (speed = 1) =>
    (pct) => {
        const angle = pct * Math.PI * 2 * speed
        return [0, 0, angle]
    }

const pendulum =
    (speed = 1, amplitude = Math.PI / 4) =>
    (pct) => {
        const angle = Math.sin(pct * Math.PI * 2 * speed) * amplitude
        return [angle, 0, 0]
    }

const gyroscope =
    (speed = 1) =>
    (pct) => {
        const a = pct * Math.PI * 2 * speed
        return [a, a * 2, a * 0.5]
    }

const shimmy =
    (speed = 1) =>
    (pct) => {
        const a = pct * Math.PI * 2 * speed
        return [Math.sin(a * 3) * 0.2, Math.cos(a * 2) * 0.3, Math.sin(a) * 0.1]
    }

const barrelRoll =
    (speed = 1) =>
    (pct) => {
        const angle = pct * Math.PI * 2 * speed
        return [angle, angle, 0]
    }

const corkscrew =
    (speed = 1) =>
    (pct) => {
        const a = pct * Math.PI * 2 * speed
        return [a, a * 1.5, a * 0.7]
    }

export { spin, tumble, wobble, twistSpin, flip, roll, pendulum, gyroscope, shimmy, barrelRoll, corkscrew }

// ─────────────────────────────
// 🎯 SCALE ANIMATORS
// ─────────────────────────────
const scaleNone = () => (pct) => 1

const pulse =
    (speed = 1) =>
    (pct) => {
        const s = 1 + Math.sin(pct * Math.PI * 2 * speed) * 0.2
        return s
    }

const squashStretch =
    (speed = 1, intensity = 0.3) =>
    (pct) => {
        const a = Math.sin(pct * Math.PI * 2 * speed) * intensity
        return 1 + a
    }

const growShrink =
    (speed = 1, minScale = 0.3, maxScale = 1.5) =>
    (pct) => {
        const s = minScale + (maxScale - minScale) * Math.abs(Math.sin(pct * Math.PI * 2 * speed))
        return s
    }

const axisWave =
    (speed = 1, amplitude = 0.2) =>
    (pct) => {
        const a = pct * Math.PI * 2 * speed
        return 1 + Math.sin(a) * amplitude
    }

const heartbeat =
    (speed = 1) =>
    (pct) => {
        const t = pct * Math.PI * 2 * speed
        const s = 1 + Math.sin(t) * 0.15 + Math.sin(t * 2) * 0.05
        return s
    }

const breathe =
    (speed = 1, intensity = 0.3) =>
    (pct) => {
        const s = 1 + Math.sin(pct * Math.PI * 2 * speed) * intensity
        return s
    }

const wobbleScale =
    (speed = 1, amplitude = 0.15) =>
    (pct) => {
        const a = pct * Math.PI * 2 * speed
        return 1 + Math.sin(a * 3) * amplitude
    }

const explode =
    (speed = 1, maxScale = 2) =>
    (pct) => {
        const s = 1 + (maxScale - 1) * Math.sin(pct * Math.PI * speed)
        return s
    }

export { scaleNone, pulse, squashStretch, growShrink, axisWave, heartbeat, breathe, wobbleScale, explode }
