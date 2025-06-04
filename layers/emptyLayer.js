export const emptyLayer = {
    defaultParams: {
        color: 'red',
    },

    render(ctx, { resolution, params }) {
        const { width, height } = resolution

        // Clear the canvas as a color
        ctx.fillStyle = params.color
        ctx.fillRect(0, 0, width, height)
    },
}
