export const text = {
    defaultParams: {
        color: '#ffffff',
        text: 'Hello World',
        size: 16,
        fontFamily: 'FivePX', // Default to FivePX font
    },

    // Load the font when the generator is initialized
    async init() {
        const font = new FontFace('FivePX', 'url(/assets/fonts/FivePX%205px%20Regular.otf)')
        try {
            await font.load()
            document.fonts.add(font)
        } catch (err) {
            console.error('Failed to load font:', err)
        }
    },

    render(ctx, { width, height, color, text, size, fontFamily }) {
        // Set text properties
        ctx.fillStyle = color
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = `${size}px ${fontFamily}, monospace` // Fallback to monospace if font fails to load

        // Disable antialiasing
        ctx.imageSmoothingEnabled = false

        // Draw text centered on pixel boundary
        const x = Math.floor(width / 2) + 0.5
        const y = Math.floor(height / 2) + 0.5
        ctx.fillText(text, x, y)
    },
}
