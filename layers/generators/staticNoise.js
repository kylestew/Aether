/**
 * Noise layer that generates random pixel noise (snow effect)
 */
export const staticNoise = {
    defaultParams: {
        density: 0.5, // Probability of a pixel being noise (0-1)
        color: '#ffffff', // Color of the noise
        alpha: 1.0, // Opacity of the noise
        seed: 0, // Random seed for consistent noise
    },

    render(ctx, { t, resolution, params }) {
        const { width, height } = resolution

        // Clear the canvas first
        ctx.clearRect(0, 0, width, height)

        // Parse color to RGB
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        tempCanvas.width = 1
        tempCanvas.height = 1
        tempCtx.fillStyle = params.color
        tempCtx.fillRect(0, 0, 1, 1)
        const [r, g, b] = tempCtx.getImageData(0, 0, 1, 1).data

        // Create image data for noise
        const imageData = ctx.createImageData(width, height)
        const data = imageData.data

        // Use a simple seeded random function
        const random = (x, y) => {
            const seed = params.seed + t
            return (Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453) % 1
        }

        // Generate noise
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4

                // Generate noise based on density
                if (random(x, y) < params.density) {
                    data[i] = r // R
                    data[i + 1] = g // G
                    data[i + 2] = b // B
                    data[i + 3] = Math.floor(params.alpha * 255) // A
                } else {
                    data[i + 3] = 0 // Transparent for non-noise pixels
                }
            }
        }

        // Put the noise directly onto the canvas
        ctx.putImageData(imageData, 0, 0)
    },
}
