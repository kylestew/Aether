// paramUtils.js
// MACROS FOR PARAMETERS

// All macros are pure functions: (t) => value
// They compose beautifully and keep code compact.

export function pulse(freq = 1, min = 0, max = 1) {
    return (t) => {
        const normalized = (Math.sin(t * freq * Math.PI * 2) + 1) / 2
        return min + normalized * (max - min)
    }
}

export function step(interval = 1, values = [0, 1]) {
    return (t) => {
        const index = Math.floor(t / interval) % values.length
        return values[index]
    }
}

export function osc(freq = 1, offset = 0) {
    return (t) => Math.sin(t * freq * Math.PI * 2 + offset)
}
export function tri(freq = 1, min = 0, max = 1) {
    return (t) => {
        const phase = (t * freq) % 1
        const val = phase < 0.5 ? phase * 2 : 2 - phase * 2
        return min + val * (max - min)
    }
}
export function saw(freq = 1, min = 0, max = 1) {
    return (t) => {
        const phase = (t * freq) % 1
        return min + phase * (max - min)
    }
}
export function noise(seed = 0) {
    return (t) => {
        const n = Math.sin(t * 12.9898 + seed * 78.233) * 43758.5453
        return n - Math.floor(n)
    }
}
export function ramp(duration = 1, min = 0, max = 1) {
    return (t) => {
        const clamped = Math.min(t / duration, 1)
        return min + clamped * (max - min)
    }
}
export function bang(interval = 1) {
    return (t) => (Math.abs(t % interval) < 0.033 ? 1 : 0)
}
export function gate(interval = 1, duty = 0.5) {
    return (t) => (t % interval < interval * duty ? 1 : 0)
}
