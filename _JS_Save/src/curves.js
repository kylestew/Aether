// curves.js

export const linear = (t) => t

export const easeIn = (t) => t * t

export const easeOut = (t) => 1 - Math.pow(1 - t, 2)

export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

export const pingPong = (t) => Math.sin(t * Math.PI)

export const bounce = (t) => Math.abs(Math.sin(t * Math.PI * 3) * (1 - t))

export const sharpEase = (t) => (t < 0.5 ? Math.pow(t * 2, 3) / 2 : 1 - Math.pow((1 - t) * 2, 3) / 2)

// Quick ease-in then snap-out
export const snapOut = (t) => Math.pow(t, 0.25) // fast rise, flattens out

// Elastic overshoot
export const elastic = (t) => {
    return t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) + 1
}

// Super fast punch
export const punch = (t) => Math.sin(t * Math.PI * 3) * (1 - t)

// Wrap any animator with a curve
export const applyCurve =
    (animator, curve = linear) =>
    (pct) => {
        return animator(curve(pct))
    }
