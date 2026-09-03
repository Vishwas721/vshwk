// Kurita-inspired particle vertex shader
// Adapted for R3F <points> morphing system

uniform float uTime;
uniform float uProgress;

attribute vec3 aTarget;

varying float vDistort;

void main() {
    // Morph between base position and target position
    vec3 pos = mix(position, aTarget, uProgress);

    // Add organic noise displacement (inspired by Kurita's rand-driven motion)
    float noise = sin(pos.x * 3.0 + uTime * 0.8) *
                  cos(pos.y * 2.5 + uTime * 0.6) *
                  sin(pos.z * 4.0 + uTime * 0.4);

    pos += normal * noise * 0.15;

    // Subtle breathing / pulsation
    float pulse = 1.0 + sin(uTime * 0.5) * 0.02;
    pos *= pulse;

    // Pass distortion factor to fragment for color modulation
    vDistort = noise;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    // Attenuate point size by distance (closer = larger)
    gl_PointSize = (3.0 + noise * 1.5) * (300.0 / -mvPosition.z);

    gl_Position = projectionMatrix * mvPosition;
}
