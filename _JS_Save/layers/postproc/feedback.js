export const feedback = {
    defaultParams: {
        hold: 0.8, // How much of the previous frame to keep (0–1)
        movement: [0, 0], // How much to move the previous frame (x, y)
        blendMode: 'source-over', // How to blend the input: 'normal', 'lighter', etc.
    },

    _prevFrame: null,

    render(ctx, { t, inputCtx, width, height, hold, blendMode, movement }) {
        if (!inputCtx) return

        // Create or resize the previous frame buffer
        if (!this._prevFrame || this._prevFrame.width !== width || this._prevFrame.height !== height) {
            this._prevFrame = document.createElement('canvas')
            this._prevFrame.width = width
            this._prevFrame.height = height
        }
        const prevCtx = this._prevFrame.getContext('2d')
        prevCtx.imageSmoothingEnabled = false // Disable antialiasing for hard pixel edges

        // Step 1: Draw the previous frame (with fade and movement)
        ctx.globalAlpha = hold
        ctx.globalCompositeOperation = blendMode || 'source-over'
        const [moveX, moveY] = movement || [0, 0]
        ctx.drawImage(this._prevFrame, moveX, moveY)

        // Step 2: Draw the current input on top
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = 'source-over'
        ctx.drawImage(inputCtx.canvas, 0, 0)

        // Step 3: Save the final output as the next _prevFrame
        prevCtx.clearRect(0, 0, width, height)
        prevCtx.drawImage(ctx.canvas, 0, 0)
    },
}
