import { compileShaderProgram } from '../../src/webgl/helpers.js'

const vertSource = `
attribute vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragSource = `
precision highp float;
uniform vec2 iResolution;
            
void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec3 color = vec3(uv, 1.0);
    gl_FragColor = vec4(color, 1.0);
}
`

export const rgbOffset = {
    defaultParams: {},

    init(params) {
        this.canvas = document.createElement('canvas')
        this.gl = this.canvas.getContext('webgl', {
            premultipliedAlpha: false,
            antialias: false,
        })
        if (!this.gl) {
            throw new Error('WebGL not supported')
        }

        const uniforms = {
            iResolution: [0, 0],
        }

        const { program, uniformLocations } = compileShaderProgram(this.gl, vertSource, fragSource, uniforms)
        this.program = program
        this.uniformLocations = uniformLocations
    },

    render(ctx, { width, height }) {
        // Update canvas size
        this.canvas.width = width
        this.canvas.height = height
        this.gl.viewport(0, 0, width, height)

        // Use shader program
        this.gl.useProgram(this.program)

        // Set uniforms
        this.gl.uniform2f(this.uniformLocations.iResolution, width, height)

        // Draw quad
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)

        // Copy WebGL canvas to 2D context
        ctx.drawImage(this.canvas, 0, 0)
    },
}
