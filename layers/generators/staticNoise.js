/**
 * Noise layer that generates random pixel noise (snow effect)
 */
export const staticNoise = {
    defaultParams: {
        seed: 0,
    },

    render(ctx, { t, width, height, seed }) {
        // Clear the canvas first
        ctx.clearRect(0, 0, width, height)

        // Create image data for noise
        const imageData = ctx.createImageData(width, height)
        const data = imageData.data

        // // Use a simple seeded random function
        // const random = (x, y) => {
        //     const sed = seed + t
        //     return (Math.sin(x * 12.9898 + y * 78.233 + sed) * 43758.5453) % 1
        // }

        // // Generate noise
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4

                const rnd = Math.random() * 255

                data[i] = rnd
                data[i + 1] = rnd
                data[i + 2] = rnd
                data[i + 3] = 255
            }
        }

        // Put the noise directly onto the canvas
        ctx.putImageData(imageData, 0, 0)
    },
}
