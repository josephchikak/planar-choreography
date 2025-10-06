varying vec2 vUv;
varying float vGroup;
varying vec3 vColor;


vec3 getGroupColor(float group) {
    // 12 distinct colors for each group - matching line colors
    if (group < 1.0) return vec3(1.0, 0.0, 0.0); // Red
    if (group < 2.0) return vec3(0.0, 1.0, 0.0); // Green
    if (group < 3.0) return vec3(0.0, 0.0, 1.0); // Blue
    if (group < 4.0) return vec3(1.0, 1.0, 0.0); // Yellow
    if (group < 5.0) return vec3(1.0, 0.0, 1.0); // Magenta
    if (group < 6.0) return vec3(0.0, 1.0, 1.0); // Cyan
    if (group < 7.0) return vec3(1.0, 0.5, 0.0); // Orange
    if (group < 8.0) return vec3(0.5, 0.0, 1.0); // Purple
    if (group < 9.0) return vec3(0.0, 0.5, 0.0); // Dark Green
    if (group < 10.0) return vec3(1.0, 0.0, 0.5); // Pink
    if (group < 11.0) return vec3(0.5, 1.0, 0.0); // Lime
    return vec3(1.0, 1.0, 1.0); // White
}

void main() {

    //circluar mask 
    vec2 center = vec2(0.5, 0.5);
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - 0.5);
    float alpha = 0.05/distanceToCenter - 0.1;



    float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = step(0.5, strength);
    strength = 1.0 - strength; 
    strength = pow(strength, 5.0);

    // strength = strength * 0.4;


  
    // vec3 color = getGroupColor(vGroup);
    // vec3 color = vec3(1.0, 1.0, 1.0);
   
// vec3 color = mix(vec3(0.0), vColor, strength);

    gl_FragColor = vec4(vec3(strength * vColor), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}