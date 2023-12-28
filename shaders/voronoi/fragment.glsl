precision mediump float;
#pragma glslify: voronoi3d = require('glsl-voronoi-noise/3d')

varying vec2 uv;
uniform float t;

void main() {
    gl_FragColor.rgb = voronoi3d(vec3(uv, t));  
    gl_FragColor.a   = 1.0;
}