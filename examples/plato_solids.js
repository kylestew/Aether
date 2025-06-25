import { createPlayer } from '../src/player.js'
import { Layer } from '../src/layer.js'
import {
    hover,
    orbit,
    bobAndWeave,
    spiralRise,
    sway,
    figure8,
    zigzag,
    bounce,
    wave,
    none,
    spin,
    tumble,
    wobble,
    twistSpin,
    flip,
    roll,
    pendulum,
    gyroscope,
    shimmy,
    barrelRoll,
    corkscrew,
    pulse,
    squashStretch,
    growShrink,
    axisWave,
    heartbeat,
    breathe,
    wobbleScale,
    explode,
    scaleNone,
} from '../src/parametrics.js'
import { applyCurve, linear, easeIn, easeOut, easeInOut, pingPong, snapOut, elastic, punch } from '../src/curves.js'

// generators
import { simple3DLayer } from '../layers/generators/simple3DLayer.js'
import { gradient } from '../layers/generators/gradient.js'
import { popcornNoise } from '../layers/generators/popcornNoise.js'

// pixel
import { blur } from '../layers/pixel/blur.js'
import { posterize } from '../layers/pixel/posterize.js'
import { vignette } from '../layers/pixel/vignette.js'
import { invert } from '../layers/pixel/invert.js'
import { adjustments } from '../layers/pixel/adjustments.js'
import { pixelate } from '../layers/pixel/pixelate.js'
import { rgbOffset } from '../layers/pixel/rgbOffset.js'

// postproc
import { cgaDither } from '../layers/postproc/cgaDither.js'

// MODES: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
// MODE 6 is closest to CGA mode 0 (320x200(CGA) - 320x180 (ours))
const mode = 6
const fullSize = [1080, 1920]
const modeSize = [fullSize[0] / mode, fullSize[1] / mode]

function randomizeShape() {
    const geometryTypes = [
        'cube',
        'sphere',
        'torus',
        'knot',
        'mobius',
        'tetrahedron',
        'octahedron',
        'dodecahedron',
        'icosahedron',
    ]

    const randomGeometryType = geometryTypes[Math.floor(Math.random() * geometryTypes.length)]

    const positionAnimations = [
        none,
        none,
        none,
        none,
        hover,
        orbit,
        bobAndWeave,
        spiralRise,
        sway,
        figure8,
        zigzag,
        bounce,
        wave,
    ]
    const positionType = positionAnimations[Math.floor(Math.random() * positionAnimations.length)]

    const rotationAnimations = [
        none,
        none,
        none,
        none,
        spin,
        tumble,
        wobble,
        twistSpin,
        flip,
        roll,
        pendulum,
        gyroscope,
        shimmy,
        barrelRoll,
        corkscrew,
    ]
    const rotationType = rotationAnimations[Math.floor(Math.random() * rotationAnimations.length)]

    const scaleAnimations = [
        scaleNone,
        scaleNone,
        scaleNone,
        scaleNone,
        pulse,
        squashStretch,
        growShrink,
        axisWave,
        heartbeat,
        breathe,
        wobbleScale,
        explode,
    ]
    const scaleType = scaleAnimations[Math.floor(Math.random() * scaleAnimations.length)]

    // Available easing curves
    const easingCurves = [linear, easeIn, easeOut, easeInOut, pingPong, snapOut, elastic, punch]

    // Random easing curves for each animation type
    const positionCurve = easingCurves[Math.floor(Math.random() * easingCurves.length)]
    const rotationCurve = easingCurves[Math.floor(Math.random() * easingCurves.length)]
    const scaleCurve = easingCurves[Math.floor(Math.random() * easingCurves.length)]

    // Log chosen settings
    console.log('Animation Settings:', {
        geometry: randomGeometryType,
        position: positionType.name,
        positionEase: positionCurve.name,
        rotation: rotationType.name,
        rotationEase: rotationCurve.name,
        scale: scaleType.name,
        scaleEase: scaleCurve.name,
    })

    return {
        backgroundColor: 'transparent',
        geometryType: randomGeometryType,

        position: applyCurve(positionType(), positionCurve),
        rotation: applyCurve(rotationType(), rotationCurve),
        scale: applyCurve(scaleType(), scaleCurve),

        // rotation: applyCurve(spin(1), easeInOut),
        // position: applyCurve(hover(2, 0.4), easeInOut),
    }
}

// Custom animation for random offset spikes
const randomOffsetSpikes = () => {
    let lastSpikeTime = 0
    let spikeDuration = 0
    let spikeIntensity = 0

    return (t) => {
        const currentTime = t * 15 // Convert to seconds (15 second duration)

        // Generate new spike randomly (5% chance per second)
        if (currentTime - lastSpikeTime > 1 && Math.random() < 0.05) {
            lastSpikeTime = currentTime
            spikeDuration = 1.0 // Half second duration
            spikeIntensity = 0.05 + Math.random() * 9.05 // Random intensity between 0.1 and 0.3
        }

        // Calculate spike value
        const timeSinceSpike = currentTime - lastSpikeTime
        if (timeSinceSpike < spikeDuration) {
            // Create a smooth spike that peaks at the middle and fades out
            const spikeProgress = timeSinceSpike / spikeDuration
            const spikeValue = spikeIntensity * Math.sin(spikeProgress * Math.PI)
            return 0.1 + spikeValue
        }

        return 0.0 // Base offset when no spike
    }
}

const layers = [
    // === BACKGROUND =================
    // Background color
    new Layer({ size: modeSize }, gradient, {
        startColor: '#000',
        endColor: '#000',
    }),

    /*
    // stylized lines
    new Layer(
        { size: modeSize },
        {
            render(ctx, { pct, width, height }) {
                // Draw a series of rotated lines
                const numLines = 32
                const spacing = height / numLines
                const extraLength = width // Add extra length to ensure coverage when rotated

                ctx.strokeStyle = '#fff'
                ctx.lineWidth = 3

                // Save context state
                ctx.save()

                // Translate to center and rotate
                ctx.translate(width / 2, height / 2)
                ctx.rotate((45 * Math.PI) / 180)
                ctx.scale(1.2, 1.2)
                ctx.translate(-width / 2, -height / 2)

                // Offset based on animation percentage
                const offset = spacing * pct * 12

                for (let i = 0; i < numLines; i++) {
                    const y = (i * spacing + offset) % height
                    ctx.beginPath()
                    ctx.moveTo(-extraLength, y)
                    ctx.lineTo(width + extraLength, y)
                    ctx.stroke()
                }

                // Restore context state
                ctx.restore()
            },
        }
    ),

    new Layer({ size: modeSize }, vignette, {
        strength: 1.0,
        radius: 0.33,
        softness: 0.2,
        center: [0.5, 0.5],
        aspectMode: 'circular',
        invert: true,
    }),
    */
    // ================================

    // === SHAPE + OVERLAY ============
    // THE SHAPE!!!
    new Layer({ size: modeSize }, simple3DLayer, {
        backgroundColor: 'transparent',
        frustumSize: 3.0,
        ...randomizeShape(),
    }),

    // gradient blended across shape to give it more interesting dithering
    new Layer({ size: modeSize, blendMode: 'overlay' }, gradient, {
        startColor: '#000000',
        endColor: '#ffffff',
    }),

    // a bit of noise for movement on the dither
    new Layer({ size: modeSize, blendMode: 'color-dodge', opacity: 0.05 }, popcornNoise),
    // ================================

    // toggle light mode
    // new Layer({ size: modeSize }, invert),

    // new Layer({ size: modeSize }, blur, { radius: (t) => 0 + Math.sin(t * Math.PI * 8) * 4 }),
    new Layer({ size: modeSize }, blur, { radius: randomOffsetSpikes() }),

    new Layer({ size: modeSize }, adjustments, {
        brightness: -0.3,
        contrast: 0.2,
        saturation: 0.0,
    }),

    new Layer({ size: modeSize }, pixelate, { pixelSize: 4 }),

    // new Layer({ size: modeSize }, rgbOffset, {
    //     offset: randomOffsetSpikes(),
    //     mode: 1,
    // }),

    // THE FINAL EFFECT!!!
    new Layer({ size: modeSize }, cgaDither, {}),
]

const player = createPlayer({
    size: fullSize,
    animated: true,
    duration: 15, // seconds
    targetFPS: 15,
    antialias: false,
    layers,
})
await player.loadAndStart()
