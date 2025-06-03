export const easingFunctions = {
    linear: (t) => t,
    easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
    easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
}

// Simple linear interpolation function
function lerp(a, b, t) {
    return a + (b - a) * t
}

function interpolateKeyframes(keyframes, t) {
    if (!keyframes || keyframes.length === 0) return null

    if (t <= keyframes[0].time) return keyframes[0].value
    if (t >= keyframes[keyframes.length - 1].time) return keyframes[keyframes.length - 1].value

    for (let i = 0; i < keyframes.length - 1; i++) {
        const kf1 = keyframes[i]
        const kf2 = keyframes[i + 1]

        if (t >= kf1.time && t <= kf2.time) {
            let nt = (t - kf1.time) / (kf2.time - kf1.time)

            // Use easing if defined
            const easeName = kf2.ease || 'linear'
            const easing = easingFunctions[easeName] || easingFunctions.linear
            nt = easing(nt)

            return lerp(kf1.value, kf2.value, nt)
        }
    }

    return null
}

// Example layer with a keyframed position and radius
export const keyframeCircleLayer = {
    defaultParams: {
        positionX: [
            { time: 0, value: 50 },
            { time: 2, value: 200, ease: 'easeOutSine' },
            { time: 5, value: 100, ease: 'easeInSine' },
        ],
        radius: [
            { time: 0, value: 20 },
            { time: 3, value: 50, ease: 'easeInOutQuad' },
            { time: 5, value: 30 },
        ],
    },

    render(ctx, { t, resolution, params }) {
        ctx.clearRect(0, 0, resolution.width, resolution.height)

        const x = interpolateKeyframes(params.positionX, t)
        const r = interpolateKeyframes(params.radius, t)

        ctx.beginPath()
        ctx.arc(x, resolution.height / 2, r, 0, Math.PI * 2)
        ctx.fillStyle = 'cyan'
        ctx.fill()
    },
}
