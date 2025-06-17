export const osc =
    (freq = 1, amplitude = 1, offset = 0) =>
    (pct) =>
        Math.sin(pct * freq * Math.PI * 2) * amplitude + offset

// export function tri(freq = 1, min = 0, max = 1) {
//     return (t) => {
//         const phase = (t * freq) % 1
//         const val = phase < 0.5 ? phase * 2 : 2 - phase * 2
//         return min + val * (max - min)
//     }
// }

// export function saw(freq = 1, min = 0, max = 1) {
//     return (t) => {
//         const phase = (t * freq) % 1
//         return min + phase * (max - min)
//     }
// }

// ─────────────────────────────
// 🎯 POSITION ANIMATORS
// ─────────────────────────────
const hover =
    (speed = 2, amplitude = 0.4) =>
    (pct) =>
        [0, Math.sin(pct * Math.PI * 2 * speed) * amplitude, 0]

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

// ─────────────────────────────
// 🎯 SCALE ANIMATORS
// ─────────────────────────────
const pulse =
    (speed = 1) =>
    (pct) => {
        const s = 1 + Math.sin(pct * Math.PI * 2 * speed) * 0.2
        return [s, s, s]
    }

export { hover, spin, tumble, wobble, twistSpin, pulse }

/*





const orbit = (pct) => {
  const a = pct * Math.PI * 2;
  return [Math.cos(a) * 1.5, 0, Math.sin(a) * 1.5];
};

const bobAndWeave = (pct) => {
  const a = pct * Math.PI * 2;
  return [Math.sin(a) * 0.5, Math.sin(a * 2) * 0.3, 0];
};

const spiralRise = (pct) => {
  const a = pct * Math.PI * 2;
  return [Math.cos(a) * 0.5, pct * 2 - 1, Math.sin(a) * 0.5];
};

const sway = (pct) => [Math.sin(pct * Math.PI * 2) * 0.6, 0, 0];





const squashStretch = (pct) => {
  const a = Math.sin(pct * Math.PI * 2) * 0.1;
  return [1 + a, 1 - a, 1 + a];
};

const growShrink = (pct) => {
  const s = Math.abs(Math.sin(pct * Math.PI));
  return [s, s, s];
};

const axisWaveScale = (pct) => {
  const a = pct * Math.PI * 2;
  return [
    1 + Math.sin(a) * 0.1,
    1 + Math.sin(a + Math.PI / 2) * 0.1,
    1 + Math.sin(a + Math.PI) * 0.1,
  ];
};
*/

/*



const orbit = (pct) => {
    const angle = pct * Math.PI * 2
    return [Math.cos(angle) * 1.5, 0, Math.sin(angle) * 1.5]
}

const bobAndWeave = (pct) => {
    const a = pct * Math.PI * 2
    return [Math.sin(a) * 0.5, Math.sin(a * 2) * 0.3, 0]
}

// scale
const pulse = (pct) => 1 + Math.sin(pct * Math.PI * 2) * 0.2
const squashStretch = (pct) => Math.sin(pct * Math.PI * 2) * 0.1
const growShrink = (pct) => Math.abs(Math.sin(pct * Math.PI))
*/

/*
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
*/
