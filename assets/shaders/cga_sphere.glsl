precision highp float;
uniform vec2 iResolution;
uniform float iTime;

#define MAX_STEPS 100
#define MAX_DIST 100.0
#define SURFACE_DIST 0.001

float sdSphere(vec3 p, float s) { return length(p) - s; }

float scene(vec3 p) {
    vec3 spherePos     = vec3(cos(iTime), 1.0, 5.0 + sin(iTime));
    float distToSphere = sdSphere(p - spherePos, 1.0);

    float distToPlane = p.y + 0.1;

    return min(distToSphere, distToPlane);
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

float shadow(vec3 point, vec3 lightPos) {
    vec3 dirToLight = normalize(lightPos - point);
    float maxDist   = length(lightPos - point);

    float t = rayMarch(point + dirToLight * 0.01, dirToLight, maxDist);
    return (t > 0.0) ? 0.0 : 1.0; // Blocked = shadow, clear = lit
}

float lighting(vec3 lightPos, vec3 point) {
    vec3 lightDir = normalize(lightPos - point);
    vec3 normal   = getNormal(point);

    float diff         = clamp(dot(normal, lightDir), 0.0, 1.0);
    float shadowFactor = shadow(point + normal * 0.01, lightPos);

    return diff * shadowFactor;
}

void main() {
    vec2 uv = (gl_FragCoord.xy / iResolution.xy) * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y; // correct for aspect ratio

    // setup camera - behind origin, looking forward
    vec3 ro = vec3(0, 1.5, -1.0);

    // light position - moving
    vec3 lightPos = vec3(1, 5, 1);
    lightPos.xz += vec2(sin(iTime), cos(iTime)) * 2.0;

    // ray direction (from camera to scene)
    vec3 rd = normalize(vec3(uv, 1.0));

    // ray marching
    float d = rayMarch(ro, rd, MAX_DIST);
    if (d < 0.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // background color
        return;
    }

    // light calculation
    vec3 p     = ro + rd * d;
    float diff = lighting(lightPos, p);
    vec3 color = vec3(1.0) * diff;

    gl_FragColor = vec4(color, 1.0);
}