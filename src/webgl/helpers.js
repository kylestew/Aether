export function compileShaderProgram(gl, vertSource, fragSource, uniforms) {
    // Create shader program
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vertSource)
    gl.compileShader(vertexShader)

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragShader, fragSource)
    gl.compileShader(fragShader)

    // Check for shader compilation errors
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        const infoLog = gl.getShaderInfoLog(vertexShader)
        const errorMessage = formatShaderError(
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

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        const infoLog = gl.getShaderInfoLog(fragShader)
        const errorMessage = formatShaderError('Fragment', fragSource, infoLog)
        throw new Error(errorMessage)
    }

    // Create and link program
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error('Program linking error: ' + gl.getProgramInfoLog(program))
    }

    // Create quad vertices
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])

    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    // Set up vertex attributes
    const positionLocation = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Get uniform locations
    let uniformLocations = {}
    Object.keys(uniforms).forEach((name) => {
        uniformLocations[name] = gl.getUniformLocation(program, name)
    })

    return { program, uniformLocations }
}

// Helper function to format shader errors
function formatShaderError(type, source, infoLog) {
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
}

// Default vertex shader for 2D quad rendering
export const defaultVertSource = `
    attribute vec2 a_position;
    varying vec2 v_texCoord;

    void main() {
        // Convert position to texture coordinates
        v_texCoord = (a_position + 1.0) * 0.5;
        
        // Pass position directly to clip space
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`
