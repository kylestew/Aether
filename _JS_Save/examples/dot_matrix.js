import { createPlayer } from '../src/player.js'
import { Layer } from '../src/layer.js'

import { image } from '../layers/media/image.js'

import { pixelPattern } from '../layers/generators/pixelPattern.js'
import { perlinNoise } from '../layers/generators/perlinNoise.js'
import { snowNoise } from '../layers/generators/snowNoise.js'

import { threshold } from '../layers/pixel/threshold.js'
import { adjustments } from '../layers/pixel/adjustments.js'
import { blur } from '../layers/pixel/blur.js'
import { vignette } from '../layers/pixel/vignette.js'
import { rgbOffset } from '../layers/pixel/rgbOffset.js'

// MODES: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
// MODE 6 is closest to CGA mode 0 (320x200(CGA) - 320x180 (ours))
const mode = 4
const fullSize = [1080, 1080]
// const fullSize = [1080, 1920]
const modeSize = [fullSize[0] / mode, fullSize[1] / mode]

const imagePath = '/assets/images/pearl.png'
// const imagePath = '/assets/images/lenna.png'
// const imagePath = '/assets/images/david.png'
// const imagePath = '/assets/images/premium_photo-1736749650508-fcf0c377868b.avif'

const ditherBlendMode = 'overlay'
// const ditherBlendMode = 'normal'
const pattern = 'bayer'
// const pattern = 'clustered_dot'
// const pattern = 'diagonal_dither'
// const pattern = 'spiral_dot_dither'
// const pattern = 'line_dither'
// const pattern = 'crosses'
// const pattern = 'beehive'

const layers = [
    // new Layer({ size: modeSize }, image, {
    //     imagePath,
    //     cropMode: 'cover',
    // }),

    // stylized lines
    new Layer(
        { size: modeSize },
        {
            render(ctx, { pct, width, height }) {
                // Draw a series of rotated lines
                const lineWidth = 4

                ctx.strokeStyle = '#fff'
                ctx.lineWidth = lineWidth * 1.0

                // Save context state
                ctx.save()

                // Translate to center and rotate
                ctx.translate(width / 2, height / 2)
                ctx.rotate(0.33 * Math.PI)
                ctx.scale(1.2, 1.2)
                ctx.translate(-width / 2, -height / 2)

                // Offset based on animation percentage
                const cycleLength = lineWidth * (255 / 12)

                const numLines = width / lineWidth
                const repeats = 9
                const colorSeg = (255 / (numLines - 1)) * repeats

                const offsetEnd = width / repeats
                const offset = (pct * 190) % offsetEnd

                for (let i = 0; i < numLines * (1 + 2 * repeats); i++) {
                    const cycle = (colorSeg * i) % 255

                    ctx.strokeStyle = `rgba(${cycle}, ${cycle}, ${cycle}, 1)`

                    const y = i * lineWidth + offset - offsetEnd * 2

                    ctx.beginPath()
                    ctx.moveTo(-width, y)
                    ctx.lineTo(width * 2, y)
                    ctx.stroke()
                }

                // Restore context state
                ctx.restore()
            },
        }
    ),

    new Layer({ size: modeSize }, blur),

    new Layer({ size: modeSize }, vignette, { strength: 0.9, softness: 0.3, radius: 0.65 }),

    new Layer({ size: modeSize, blendMode: 'overlay', opacity: 0.12 }, snowNoise),

    new Layer({ size: modeSize, blendMode: 'multiply' }, perlinNoise),

    new Layer({ size: modeSize }, adjustments, {
        brightness: 0.3,
        contrast: 0.1,
        saturation: 0.0,
        hue: 0.0,
    }),

    new Layer({ enabled: false, size: modeSize, blendMode: ditherBlendMode }, pixelPattern, {
        pattern,
        scale: 1,
        opacity: 0,
    }),
    new Layer({ enabled: false, size: modeSize }, threshold, {
        color: '00eaff',
        backgroundColor: '122409',
        threshold: 0.5,
        factor: 0.0,
    }),

    new Layer({ enabled: true, size: modeSize }, rgbOffset),
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
