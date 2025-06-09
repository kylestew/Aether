export const shaderLayer = {
    defaultParams: {
        // Default shader is a simple gradient animation
        fragSource: `
            precision highp float;
            uniform vec2 iResolution;
            uniform float iTime;
            
            void main() {
                vec2 uv = gl_FragCoord.xy / iResolution.xy;
                vec3 color = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0,2,4));
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        uniforms: {}, // Custom uniforms can be added here
    },

    // Helper function to format shader errors
    _formatShaderError(type, source, infoLog) {
        const lines = source.split('\n')
        const errorLines = infoLog.split('\n')

        // Extract line number from WebGL error message (format: "ERROR: 0:X: message")
        const lineMatch = infoLog.match(/ERROR: 0:(\d+):/)
        const errorLine = lineMatch ? parseInt(lineMatch[1]) : null

        let errorMessage = `\n${type} Shader Compilation Error:\n\n`

        if (errorLine !== null) {
            // Show context around the error (3 lines before and after)
            const start = Math.max(0, errorLine - 3)
            const end = Math.min(lines.length, errorLine + 2)

            errorMessage += 'Source code around error:\n'
            for (let i = start; i < end; i++) {
                const prefix = i === errorLine - 1 ? '>>> ' : '    '
                errorMessage += `${prefix}${i + 1}: ${lines[i]}\n`
            }
            errorMessage += '\n'
        }

        errorMessage += 'Error details:\n'
        errorLines.forEach((line) => {
            errorMessage += `  ${line}\n`
        })

        errorMessage += '\nFull shader source:\n'
        lines.forEach((line, i) => {
            errorMessage += `${i + 1}: ${line}\n`
        })

        return errorMessage
    },

    async init(params) {
        this.params = { ...this.defaultParams, ...params }
        this.uniforms = { ...this.params.uniforms }
        this.startTime = Date.now() / 1000

        // Create canvas and get WebGL context
        this.canvas = document.createElement('canvas')
        this.gl = this.canvas.getContext('webgl')

        if (!this.gl) {
            throw new Error('WebGL not supported')
        }

        // Create shader program
        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
        this.gl.shaderSource(
            vertexShader,
            `
            attribute vec2 position;
            void main() {
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `
        )
        this.gl.compileShader(vertexShader)

        const fragShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
        this.gl.shaderSource(fragShader, this.params.fragSource)
        this.gl.compileShader(fragShader)

        // Check for shader compilation errors
        if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
            const infoLog = this.gl.getShaderInfoLog(vertexShader)
            const errorMessage = this._formatShaderError(
                'Vertex',
                `
                attribute vec2 position;
                void main() {
                    gl_Position = vec4(position, 0.0, 1.0);
                }
            `,
                infoLog
            )
            throw new Error(errorMessage)
        }

        if (!this.gl.getShaderParameter(fragShader, this.gl.COMPILE_STATUS)) {
            const infoLog = this.gl.getShaderInfoLog(fragShader)
            const errorMessage = this._formatShaderError('Fragment', this.params.fragSource, infoLog)
            throw new Error(errorMessage)
        }

        // Create and link program
        this.program = this.gl.createProgram()
        this.gl.attachShader(this.program, vertexShader)
        this.gl.attachShader(this.program, fragShader)
        this.gl.linkProgram(this.program)

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            throw new Error('Program linking error: ' + this.gl.getProgramInfoLog(this.program))
        }

        // Create quad vertices
        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])

        this.vertexBuffer = this.gl.createBuffer()
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW)

        // Get uniform locations
        this.uniformLocations = {
            iResolution: this.gl.getUniformLocation(this.program, 'iResolution'),
            iTime: this.gl.getUniformLocation(this.program, 'iTime'),
        }

        // Add custom uniform locations
        Object.keys(this.uniforms).forEach((name) => {
            this.uniformLocations[name] = this.gl.getUniformLocation(this.program, name)
        })
    },

    render(ctx, { resolution, params = {} }) {
        const { width, height } = resolution

        // Update canvas size
        this.canvas.width = width
        this.canvas.height = height
        this.gl.viewport(0, 0, width, height)

        // Use shader program
        this.gl.useProgram(this.program)

        // Set up vertex attributes
        const positionLocation = this.gl.getAttribLocation(this.program, 'position')
        this.gl.enableVertexAttribArray(positionLocation)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0)

        // Set uniforms
        this.gl.uniform2f(this.uniformLocations.iResolution, width, height)
        this.gl.uniform1f(this.uniformLocations.iTime, Date.now() / 1000 - this.startTime)

        // Set custom uniforms
        Object.entries(this.uniforms).forEach(([name, value]) => {
            const location = this.uniformLocations[name]
            if (location !== null) {
                if (Array.isArray(value)) {
                    switch (value.length) {
                        case 2:
                            this.gl.uniform2fv(location, value)
                            break
                        case 3:
                            this.gl.uniform3fv(location, value)
                            break
                        case 4:
                            this.gl.uniform4fv(location, value)
                            break
                        default:
                            this.gl.uniform1f(location, value[0])
                    }
                } else {
                    this.gl.uniform1f(location, value)
                }
            }
        })

        // Draw quad
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)

        // Copy WebGL canvas to 2D context
        ctx.drawImage(this.canvas, 0, 0)
    },

    // Helper method to update uniforms
    setUniform(name, value) {
        this.uniforms[name] = value
    },
}
