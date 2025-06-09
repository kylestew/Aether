export const blur = {
    defaultParams: {
        radius: 8, // Blur radius in pixels
    },

    render(ctx, { inputCtx, radius }) {
        // Apply blur to the whole canvas content
        ctx.filter = `blur(${radius}px)`
        ctx.drawImage(inputCtx.canvas, 0, 0) // draw itself with blur
        ctx.filter = 'none'
    },
}
