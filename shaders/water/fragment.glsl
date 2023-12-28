uniform sampler2D envMap;
uniform samplerCube skybox;

varying vec2 refractedPosition[3];
varying vec3 reflected;
varying float reflectionFactor;

void main() {
    //vec3 reflectedColor = 
    
    vec3 refractedColor = vec3(1.);
    refractedColor.r = texture2D(envMap, refractedPosition[0] * 0.5 + 0.5).r;
    refractedColor.g = texture2D(envMap, refractedPosition[1] * 0.5 + 0.5).g;
    refractedColor.b = texture2D(envMap, refractedPosition[2] * 0.5 + 0.5).b;

    gl_FragColor = vec4(refractedColor, 1.);
}