#ifdef GL_ES
precision mediump float;
#endif

void drawGrid(vec2 st, inout vec3 pixel) {
    const float tickWidth = 0.1;
    vec3 gridColor        = vec3(0.5);
    if (mod(st.x, tickWidth) < 0.002)
        pixel = gridColor;
    if (mod(st.y, tickWidth) < 0.002)
        pixel = gridColor;

    vec3 axesColor = vec3(1, 1, 1);
    if (abs(st.x) < 0.004)
        pixel = axesColor;
    if (abs(st.y) < 0.004)
        pixel = axesColor;
}

/* https://www.shadertoy.com/view/4tlyD8 */

// float uBblur = 0.25; // 4.0
// float falloff = 3.0;
// float sampleCount = 50.0;

uniform float uBlur;
uniform float uFalloff;
uniform float uSampleCount;

out vec4 fragColor;
void main() {
    vec2 uv = vUV.st;
    vec2 st = uv - 0.5;

    vec2 dir       = normalize(st);
    float strength = pow(length(st), uFalloff);
    vec2 vel       = dir * uBlur * strength;

    float inverseSampleCount = 1.0 / uSampleCount;

    mat3x2 increments =
        mat3x2(vel * 1.0 * inverseSampleCount, vel * 2.0 * inverseSampleCount, vel * 3.0 * inverseSampleCount);

    vec3 accum     = vec3(0);
    mat3x2 offsets = mat3x2(0);

    for (int i = 0; i < uSampleCount; i++) {
        accum.r += texture(sTD2DInputs[0], uv + offsets[0]).r;
        accum.g += texture(sTD2DInputs[0], uv + offsets[1]).g;
        accum.b += texture(sTD2DInputs[0], uv + offsets[2]).b;

        offsets -= increments;
    }
    accum /= uSampleCount;

    // drawGrid(st, accum);

    fragColor = TDOutputSwizzle(vec4(accum, 1.0));
}
