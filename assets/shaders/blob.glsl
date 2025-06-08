precision highp float;

uniform vec2 iResolution;
uniform float iTime;

#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURFACE_DIST 0.001

mat2 rot(float a) { return mat2(cos(a), sin(a), -sin(a), cos(a)); }

float sdSphere(vec3 p, float s) { return length(p) - s; }

float scene(vec3 p) {
    float de = 0.0;

    de += length(p) - 5.0;

    de += (sin(p.x * 3.0424 + iTime * 1.9318) * .5 + .5) * 0.3;
    de += (sin(p.y * 2.0157 + iTime * 1.5647) * .5 + .5) * 0.4;

    return de;
}

// General-purpose ray marcher with a maxDistance limit
// Returns -1.0 if no hit, or distance to the hit point
float rayMarch(vec3 ro, vec3 rd, float maxDist) {
    float t = 0.0;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 pos = ro + rd * t;
        float d  = scene(pos);
        if (d < SURFACE_DIST)
            return t; // Hit something
        t += d;
        if (t > maxDist)
            break; // Gave up before hitting
    }
    return -1.0; // Didn't hit anything
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);

    float dx = scene(p + e.xyy) - scene(p - e.xyy);
    float dy = scene(p + e.yxy) - scene(p - e.yxy);
    float dz = scene(p + e.yyx) - scene(p - e.yyx);

    return normalize(vec3(dx, dy, dz));
}

void main() {
    vec2 uv = (gl_FragCoord.xy / iResolution.xy) * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y; // correct for aspect ratio

    // setup camera - behind origin, looking forward
    vec3 ro = vec3(-50, 0, 0);

    // light position - moving
    vec3 lightPos = vec3(1, -3.0, 2.0);
    lightPos.xz += vec2(sin(iTime), cos(iTime)) * 2.0;

    // ray direction (from camera to scene)
    float zoom = 0.2;
    vec3 rd    = normalize(vec3(uv * zoom, 1.0));
    rd.xz *= rot(3.1415 * .5); // Rotate 90 degrees around Y axis

    // ray marching
    float d = rayMarch(ro, rd, MAX_DIST);

    // shading
    if (d < 0.0) {
        // Background with animated pattern
        vec2 pos     = gl_FragCoord.xy - iResolution.xy * 0.5;
        vec2 dir     = vec2(0.0, 1.0) * rot(sin(iTime * 0.4545) * 0.112);
        float value  = sin(dot(pos, dir) * 0.048 - iTime * 1.412) * 0.5 + 0.5;
        gl_FragColor = vec4(vec3(value), 1.0);
    } else {
        // Object shading with greyscale lighting
        vec3 p           = ro + rd * d;
        vec3 norm        = getNormal(p);
        vec3 light       = normalize(vec3(1.0, -3.0, 2.0));
        float brightness = dot(light, norm) * 0.5 + 0.5;
        gl_FragColor     = vec4(vec3(brightness), 1.0);
    }
}