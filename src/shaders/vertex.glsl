
  // vec2 f =freqGroup(group);
  //   float phase = i * 0.1;  // shift each particle
  //   float x = cos(f.x * time + phase);
  //   float y = sin(f.y * 2.0 * (time + phase));
  //   float z = cnoise(vec3(phase, time * 0.2, 0.0)) ;

  //   return vec3(x, y, z);







// Extended planar choreographies based on the classification image
// #pragma glslify: rotation3dY = require('glsl-rotate/rotation-3d-y') 
mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(
    c, 0.0, -s,
    0.0, 1.0, 0.0,
    s, 0.0, c
  );
}

uniform float uTime;
varying vec2 vUv;
uniform float uRadius;
#include ./include/perlin.glsl
attribute float group;
varying float vGroup;

vec3 choreographedPosition(float i, float time, float group) {
    float phase = i * 0.1;
    float n = floor(i); // particle index for multi-body patterns
    
    // Add spatial separation between groups
    // vec3 groupOffset = vec3(
    //     mod(group, 2.0),  // X spacing: 4 columns
    //     floor(group / 2.0), // Y spacing: 4 rows
    //     0.0
    // );

    float period = 3.14159;
    // time += (0.4  / period) + phase;

    vec3 groupOffset = vec3(0.0);
    
    // D(6,4) patterns - from images (a), (b), (c), (d)
    if (abs(group - 0.0) < 0.5) { // (a) Square-like with loops - Period: π
        // float period = 3.14159;
        // float t = time * (2.0 * 3. s14159 / period) + phase;
        float x = cos(phase + time) + 0.3 * cos(4.0 * phase + time);
        float y = sin(phase + time) + 0.3 * sin(4.0 * phase + time);
        float z = cnoise(vec3(0.2 * sin(2.0 * phase + time)));
        return vec3(x, y, z) + groupOffset;
    }
    
    if (abs(group - 1.0) < 0.5) { // (b) Cross pattern with diagonal loops
        float x = cos(time + phase) * (1.0 + 0.4 * cos(4.0 * time));
        float y = sin(time + phase) * (1.0 + 0.4 * sin(4.0 * time));
        float z = 0.3 * cos(time * 0.7 + phase);
        return vec3(x, y, z);
    }
    
    if (abs(group - 2.0) < 0.5) { // (c) Four-leaf clover
        float r = sin(2.0 * (time + phase));
        float x = r * cos(time + phase);
        float y = r * sin(time + phase);
        float z = 0.25 * sin(3.0 * time + phase);
        return vec3(x, y, z) + groupOffset;
    }
    
    if (abs(group - 3.0) < 0.5) { // (d) Complex butterfly/bowtie
        float x = sin(time + phase) * (2.0 + cos(3.0 * time + phase));
        float y = cos(time + phase) * sin(2.0 * time + phase);
        float z = 0.4 * sin(time * 1.3 + phase);
        return vec3(x, y,  z) + groupOffset;
    }
    
    // D(8,3) patterns - from images (e), (f), (g), (h)
    if (abs(group - 4.0) < 0.5) { // (e) Triple loop
        float x = cos(time + phase) + 0.5 * cos(3.0 * time + phase);
        float y = sin(time + phase) + 0.5 * sin(3.0 * time + phase);
        float z = 0.3 * cos(time * 0.8 + phase);
        return vec3(x , y , z) + groupOffset;
    }
    
    if (abs(group - 5.0) < 0.5) { // (f) Figure-eight with twist
        float a = 1.0;
        float t = time + phase;
        float x = a * cos(t) / (1.0 + sin(t) * sin(t));
        float y = a * sin(t) * cos(t) / (1.0 + sin(t) * sin(t));
        float z = 0.4 * sin(3.0 * t);
        return vec3(x, y, z) + groupOffset;
    }
    
    if (abs(group - 6.0) < 0.5) { // (g) Trefoil-like pattern
        float x = sin(time + phase) + 0.5 * sin(3.0 * time + phase);
        float y = cos(time + phase) + 0.5 * cos(3.0 * time + phase);
        float z = 0.5 * sin(2.0 * time + phase);
        return vec3(x * 0.6, y * 0.6, z) + groupOffset;
    }
    
    if (abs(group - 7.0) < 0.5) { // (h) Spiral loops
        float r = 1.0 + 0.3 * sin(3.0 * time + phase);
        float x = r * cos(time + phase);
        float y = r * sin(time + phase);
        float z = 0.6 * cos(time * 1.5 + phase);
        return vec3(x * 0.8, y * 0.8, z) + groupOffset;
    }
    
    // Higher complexity patterns D(4,6), D(5,8), D(8,9/2), D(8,9/4)
    if (abs(group - 8.0) < 0.5) { // (i) D(4,6) - Flower with 6 petals
        float k = 6.0;
        float r = cos(k * (time + phase));
        float x = r * cos(time + phase);
        float y = r * sin(time + phase);
        float z = 0.3 * sin(k * time + phase);
        return vec3(x, y, z) + groupOffset;
    }
    
    if (abs(group - 9.0) < 0.5) { // (j) D(5,8) - Complex rosette
        float k = 8.0 / 5.0;
        float r = cos(k * (time + phase));
        float x = r * cos(time + phase);
        float y = r * sin(time + phase);
        float z = 0.4 * cos(2.0 * time + phase);
        return vec3(x, y, z) + groupOffset;
    }
    
    if (abs(group - 10.0) < 0.5) { // (k) D(8,9/2) - Star pattern
        float k = 4.5;
        float r = cos(k * (time + phase));
        float x = r * cos(time + phase);
        float y = r * sin(time + phase);
        float z = 0.2 * sin(k * 2.0 * time + phase);
        return vec3(x, y, z) + groupOffset;
    }
    
    if (abs(group - 11.0) < 0.5) { // (l) D(8,9/4) - Radial spokes
        float angle = time + phase;
        float x = cos(angle) + 0.4 * cos(9.0 * angle / 4.0);
        float y = sin(angle) + 0.4 * sin(9.0 * angle / 4.0);
        float z = 0.3 * sin(2.25 * angle);
        return vec3(x * 0.8, y * 0.8, z) + groupOffset;
    }
    
    // More exotic patterns D(8,7), D(9,4), D(9,4), D(10,5/2)
    if (abs(group - 12.0) < 0.5) { // (m) D(8,7) - Seven-fold flower
        float k = 7.0;
        float r = abs(cos(k * (time + phase) / 8.0));
        float x = r * cos(time + phase);
        float y = r * sin(time + phase);
        float z = 0.5 * sin(k * time / 4.0 + phase);
        return vec3(x, y, z) + groupOffset;
    }
    
    if (abs(group - 13.0) < 0.5) { // (n) D(9,4) - Enneagon with 4-fold
        float r = 1.0 + 0.3 * cos(4.0 * (time + phase));
        float x = r * cos(time + phase);
        float y = r * sin(time + phase);
        float z = 0.4 * sin(4.0 * time / 9.0 + phase);
        return vec3(x * 0.9, y * 0.9, z) + groupOffset;
    }
    
    if (abs(group - 14.0) < 0.5) { // (o) D(9,4) - Alternative form
        float x = cos(time + phase) + 0.5 * cos(4.0 * time + phase);
        float y = sin(time + phase) - 0.5 * sin(4.0 * time + phase);
        float z = 0.6 * cos(time * 1.2 + phase);
        return vec3(x * 0.7, y * 0.7, z) + groupOffset;
    }
    
    if (abs(group - 15.0) < 0.5) { // (p) D(10,5/2) - Pentagon star
        float k = 2.5;
        float r = cos(k * (time + phase));
        float x = r * cos(time + phase);
        float y = r * sin(time + phase);
        float z = 0.3 * sin(k * 2.0 * time + phase);
        return vec3(x, y, z) + groupOffset;
    }
    
    // Fallback circle
    return vec3(cos(time + phase), sin(time + phase), 0.0);
}

void main() {
    vGroup = group;
    
    float distanceFactor = pow(2.0 - distance(position, vec3(0.0)), 1.5);
    float size = distanceFactor * 1.5 + 5.0;
    
    vec3 particlePosition = choreographedPosition(float(gl_VertexID), uTime * 0.02, float(group));
    
    vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
    gl_PointSize = size;
    gl_PointSize *= (1.0 / -viewPosition.z);
    
    vUv = uv;
}