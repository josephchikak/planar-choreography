varying vec2 vUv;
varying float vGroup;

void main() {
    vec3 color;
    
    // Row 1: D(6,4) patterns - Warm colors
    if (vGroup == 0.0) {
        color = vec3(0.91, 0.30, 0.24); // Crimson Red
    } else if (vGroup == 1.0) {
        color = vec3(0.95, 0.52, 0.19); // Orange
    } else if (vGroup == 2.0) {
        color = vec3(0.98, 0.74, 0.02); // Golden Yellow
    } else if (vGroup == 3.0) {
        color = vec3(0.85, 0.33, 0.58); // Magenta Pink
    }
    
    // Row 2: D(8,3) patterns - Cool colors
    else if (vGroup == 4.0) {
        color = vec3(0.20, 0.60, 0.86); // Sky Blue
    } else if (vGroup == 5.0) {
        color = vec3(0.13, 0.44, 0.71); // Deep Blue
    } else if (vGroup == 6.0) {
        color = vec3(0.40, 0.23, 0.72); // Purple
    } else if (vGroup == 7.0) {
        color = vec3(0.29, 0.69, 0.31); // Forest Green
    }
    
    // Row 3: Higher complexity - Earth tones
    else if (vGroup == 8.0) {
        color = vec3(0.18, 0.80, 0.44); // Emerald Green
    } else if (vGroup == 9.0) {
        color = vec3(0.00, 0.74, 0.83); // Cyan
    } else if (vGroup == 10.0) {
        color = vec3(0.61, 0.35, 0.71); // Lavender
    } else if (vGroup == 11.0) {
        color = vec3(0.83, 0.68, 0.22); // Gold
    }
    
    // Row 4: Most complex - Vibrant colors
    else if (vGroup == 12.0) {
        color = vec3(0.89, 0.10, 0.47); // Hot Pink
    } else if (vGroup == 13.0) {
        color = vec3(0.50, 0.00, 0.00); // Maroon
    } else if (vGroup == 14.0) {
        color = vec3(0.25, 0.88, 0.82); // Turquoise
    } else if (vGroup == 15.0) {
        color = vec3(0.58, 0.00, 0.83); // Violet
    }
    
    // Fallback
    else {
        color = vec3(0.5, 0.5, 0.5); // Gray
    }

    gl_FragColor = vec4(color, 1.0);
}