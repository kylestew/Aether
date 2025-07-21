precision mediump float;

uniform sampler2D u_texture;
uniform float u_aspect;
uniform int u_mode;
uniform float u_offset;
uniform float u_rotation;

varying vec2 v_texCoord;

const float PI = 3.141592653589793;

// Helper: Rotate a point around a center with aspect ratio compensation
vec2 rotate2D(vec2 pt, vec2 center, float angle, float aspect) {
    pt -= center;
    pt.x *= aspect;

    float cosA = cos(angle);
    float sinA = sin(angle);

    float xNew = pt.x * cosA - pt.y * sinA;
    float yNew = pt.x * sinA + pt.y * cosA;

    pt = vec2(xNew, yNew);
    pt.x /= aspect;
    pt += center;
    return pt;
}

// Helper: Zoom a point around a center
vec2 zoom(vec2 pt, vec2 center, float scale) { return (pt - center) * scale + center; }

// Mirror wrap mode
vec2 mirrorUV(vec2 uv) {
    uv = abs(fract(uv * 0.5) * 2.0 - 1.0);
    return uv;
}

void main() {
    vec2 uv = v_texCoord;

    vec2 rOffset = vec2(0.0);
    vec2 gOffset = vec2(0.0);
    vec2 bOffset = vec2(0.0);
    float theta  = u_rotation;

    if (u_mode == 0) {
        rOffset = vec2(-u_offset, 0.0);
        bOffset = vec2(u_offset, 0.0);
    } else if (u_mode == 1) {
        rOffset = vec2(-0.5, -0.2877) * u_offset;
        gOffset = vec2(0.5, -0.2877) * u_offset;
        bOffset = vec2(0.0, 0.5774) * u_offset;
        theta += -PI / 3.0;
    }

    if (u_mode == 0 || u_mode == 1) {
        rOffset = rotate2D(rOffset, vec2(0.0), theta, u_aspect);
        gOffset = rotate2D(gOffset, vec2(0.0), theta, u_aspect);
        bOffset = rotate2D(bOffset, vec2(0.0), theta, u_aspect);
    }

    vec2 uv_r = uv + rOffset;
    vec2 uv_g = uv + gOffset;
    vec2 uv_b = uv + bOffset;

    vec3 offsetPhases = vec3(0.0, PI / 2.0, PI) + u_rotation;

    if (u_mode == 2) {
        vec3 scales = vec3(1.0) - cos(offsetPhases) * u_offset;
        uv_r        = zoom(uv_r, vec2(0.5), scales.x);
        uv_g        = zoom(uv_g, vec2(0.5), scales.y);
        uv_b        = zoom(uv_b, vec2(0.5), scales.z);
    } else if (u_mode == 3) {
        vec3 rotations = cos(offsetPhases) * u_offset;
        uv_r           = rotate2D(uv_r, vec2(0.5), rotations.x, u_aspect);
        uv_g           = rotate2D(uv_g, vec2(0.5), rotations.y, u_aspect);
        uv_b           = rotate2D(uv_b, vec2(0.5), rotations.z, u_aspect);
    }

    uv_r = mirrorUV(uv_r);
    uv_g = mirrorUV(uv_g);
    uv_b = mirrorUV(uv_b);

    gl_FragColor = vec4(texture2D(u_texture, uv_r).r, texture2D(u_texture, uv_g).g, texture2D(u_texture, uv_b).b, 1.0);
}
