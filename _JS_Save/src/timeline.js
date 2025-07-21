const timeline = {
    x: [
        { time: 0, value: 50 },
        { time: 10, value: 250 },
    ],
    scale: [
        { time: 0, value: 0.5 },
        { time: 10, value: 1.5 },
    ],
}

function lerp(a, b, t) {
    return a + (b - a) * t
}

export function getTimelineValue(trackName, t) {
    const track = timeline[trackName]
    if (!track) return 0
    for (let i = 0; i < track.length - 1; i++) {
        const k1 = track[i],
            k2 = track[i + 1]
        if (t >= k1.time && t <= k2.time) {
            const localT = (t - k1.time) / (k2.time - k1.time)
            return lerp(k1.value, k2.value, localT)
        }
    }
    return track[track.length - 1].value
}

export { timeline }
