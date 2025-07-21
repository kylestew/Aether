export const blur = {
    defaultParams: {
        radius: 8, // Blur radius in pixels
    },

    render(ctx, { inputCtx, width, height, radius }) {
        // Apply blur to the whole canvas content
        ctx.filter = `blur(${radius}px)`

        const { width: inputWidth, height: inputHeight } = inputCtx.canvas

        ctx.drawImage(inputCtx.canvas, 0, 0, inputWidth, inputHeight, 0, 0, width, height) // draw itself with blur

        ctx.filter = 'none'
    },
}
