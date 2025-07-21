export const nullLayer = {
    render(ctx, { inputCtx }) {
        if (!inputCtx) return
        ctx.drawImage(inputCtx.canvas, 0, 0)
    },
}
