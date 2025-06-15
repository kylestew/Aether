export const invert = {
    defaultParams: {
        // No parameters needed for simple inversion
    },

    render(ctx, { inputCtx, width, height }) {
        // Apply inversion to the whole canvas content
        ctx.filter = 'invert(1)'

        const { width: inputWidth, height: inputHeight } = inputCtx.canvas

        ctx.drawImage(inputCtx.canvas, 0, 0, inputWidth, inputHeight, 0, 0, width, height)

        ctx.filter = 'none'
    },
}
