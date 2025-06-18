import { compileShaderProgram, defaultVertSource } from '../../src/webgl/helpers.js'
import fragSource from './rgbOffset.glsl?raw'

export const rgbOffset = {
    defaultParams: {
        offset: 0.02,
        rotation: 0.0,
        mode: 0, // 0: horizontal, 1: triangular, 2: zoom, 3: rotation
    },

    async init(params) {
        this.canvas = document.createElement('canvas')
        this.gl = this.canvas.getContext('webgl', {
            premultipliedAlpha: false,
            antialias: false,
        })
        if (!this.gl) {
            throw new Error('WebGL not supported')
        }

        const uniforms = {
            u_texture: null,
            u_aspect: 1.0,
            u_mode: 0,
            u_offset: 0.02,
            u_rotation: 0.0,
        }

        const { program, uniformLocations } = compileShaderProgram(this.gl, defaultVertSource, fragSource, uniforms)
        this.program = program
        this.uniformLocations = uniformLocations

        // Create texture
        this.texture = this.gl.createTexture()
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
    },

    render(ctx, { inputCtx, width, height, offset, rotation, mode }) {
        if (!inputCtx) return

        // Update canvas size
        this.canvas.width = width
        this.canvas.height = height
        this.gl.viewport(0, 0, width, height)

        // Upload texture data
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, inputCtx.canvas)

        // Use shader program
        this.gl.useProgram(this.program)

        // Set uniforms
        this.gl.uniform1f(this.uniformLocations.u_aspect, width / height)
        this.gl.uniform1i(this.uniformLocations.u_mode, mode || 0)
        this.gl.uniform1f(this.uniformLocations.u_offset, offset || 0.02)
        this.gl.uniform1f(this.uniformLocations.u_rotation, rotation || 0.0)

        // Bind texture to texture unit 0
        this.gl.activeTexture(this.gl.TEXTURE0)
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
        this.gl.uniform1i(this.uniformLocations.u_texture, 0)

        // Draw quad
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)

        // Copy WebGL canvas to 2D context
        ctx.drawImage(this.canvas, 0, 0)
    },
}
