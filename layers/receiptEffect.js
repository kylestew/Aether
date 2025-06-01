/*
https://blog.maximeheckel.com/posts/post-processing-as-a-creative-medium/#:~:text=we%20want%20(foreshadowing%20%F0%9F%91%80)-,Shaping%20pixels,-We%20could%20leave

Sort of like a dithered effect.

- Each cell is composed of horizontal black bars.
- The darker the area, the longer the bar.
- The lighter the area, the shorter the bar (or no bar).
*/
export function renderReceiptEffect(ctx, { inputCtx, resolution }) {
    if (!inputCtx) return

    const { width, height } = resolution
    const pixelSize = 8 // Size of each "pixel" in the effect

    // take the input image and create an output in ctx

    // Clear main canvas and draw the pixelated version
    // ctx.clearRect(0, 0, width, height)
    // ctx.imageSmoothingEnabled = false // Disable smoothing for crisp pixels
    // ctx.drawImage(tempCanvas, 0, 0, width, height)
}
