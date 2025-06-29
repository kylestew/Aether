import { createPlayer } from '../src/player.js'
import { Layer } from '../src/layer.js'

import { image } from '../layers/media/image.js'
import { rgbOffset } from '../layers/pixel/rgbOffset.js'

// 135 x 240 mode
// MODES AVAILABLE: 120, 60, 40, 30, 24, 20, 15, 12, 10, 8, 6, 5, 4, 3, 2, 1
// MODE 6 is closest to CGA mode 0 (320x200(CGA) - 320x180 (ours))
const mode = 1
const fullSize = [1080, 1920]
const modeSize = [fullSize[0] / mode, fullSize[1] / mode]

// const imagePath = '/assets/images/pearl.png'
const imagePath = '/assets/images/lenna.png'
// const imagePath = '/assets/images/david.png'
// const imagePath = '/assets/images/premium_photo-1736749650508-fcf0c377868b.avif'

const layers = [
    new Layer({ size: modeSize }, image, {
        imagePath,
        cropMode: 'cover',
    }),
    new Layer({ size: modeSize }, rgbOffset, {
        offset: (pct) => 0.01 + 0.1 * Math.sin(pct * Math.PI * 2), // Animate offset
        rotation: (pct) => pct * Math.PI * 2, // Animate rotation
        mode: 2, // 0: horizontal, 1: triangular, 2: zoom, 3: rotation
    }),
]

const player = createPlayer({
    size: fullSize,
    animated: true,
    duration: 10, // seconds
    targetFPS: 30, // cap rendering at 30 fps
    layers,
})
await player.loadAndStart()
