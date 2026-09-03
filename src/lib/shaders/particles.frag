// Kurita-inspired particle fragment shader
// Soft radial glow with color modulation

uniform vec3 uColor;
uniform float uTime;

varying float vDistort;

void main() {
    // Create soft circular particle (discard corners for round points)
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);

    // Discard pixels outside the circle radius
    if (dist > 0.5) discard;

    // Soft radial falloff — core is bright, edges fade
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= alpha; // Quadratic falloff for a sharper glow

    // Modulate color with distortion for organic variation
    // Kurita's signature: subtle hue shifting per-particle
    vec3 color = uColor;
    color.r += vDistort * 0.12;
    color.b += sin(uTime * 0.3 + vDistort * 6.0) * 0.08;

    // Final output with pre-multiplied alpha for additive blending
    gl_FragColor = vec4(color * alpha, alpha * 0.85);
}
