export function createEmptyLayer() {
    return {
        render(ctx, { resolution }) {
            const { width, height } = resolution

            // Clear the canvas as a color
            ctx.fillStyle = 'red'
            ctx.fillRect(0, 0, width, height)
        },
    }
}
