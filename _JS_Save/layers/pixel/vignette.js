export const vignette = {
    defaultParams: {
        strength: 0.5, // How strong the vignette effect is (0–1)
        radius: 0.75, // How far from center the vignette starts (0–1)
        softness: 0.5, // How soft the transition is (0–1)
        center: [0.5, 0.5], // Center point of vignette [x, y] (0–1)
        aspectMode: 'canvas', // 'circular' or 'canvas'
        invert: false, // If true, inverts vignette (brightens edges)
    },

    render(ctx, { inputCtx, width, height, strength, radius, softness, center, aspectMode, invert }) {
        if (!inputCtx) return

        const imageData = inputCtx.getImageData(0, 0, width, height)
        const data = imageData.data

        const centerX = center[0] * width
        const centerY = center[1] * height

        const aspect = width / height
        const softnessSafe = Math.max(0.01, softness)

        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % width
            const y = Math.floor(i / 4 / width)

            let dx = (x - centerX) / (width * radius)
            let dy = (y - centerY) / (height * radius)

            if (aspectMode === 'canvas') {
                dy *= aspect
            } else if (aspectMode === 'circular') {
                const scale = Math.max(width, height)
                dx = (x - centerX) / (scale * radius)
                dy = (y - centerY) / (scale * radius)
            }

            const distance = Math.sqrt(dx * dx + dy * dy)
            const vignetteFactor = Math.max(0, 1 - Math.pow(distance, 2 / softnessSafe))

            const effect = strength * (1 - vignetteFactor)
            // const factor = effect
            const factor = invert ? effect : 1 - effect

            data[i] = Math.min(255, data[i] * factor) // R
            data[i + 1] = Math.min(255, data[i + 1] * factor) // G
            data[i + 2] = Math.min(255, data[i + 2] * factor) // B
        }

        inputCtx.putImageData(imageData, 0, 0)
        ctx.drawImage(inputCtx.canvas, 0, 0)
    },
}
