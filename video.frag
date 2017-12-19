/*{
  "IMPORTED": {
    video: { PATH: "./vj/14.mp4" }
  }
}*/
precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D renderBuffer;
uniform sampler2D backbuffer;
uniform sampler2D video;
#pragma glslify: rotate = require(./util/rotate.glsl)

vec2 scale(in vec2 st, in float r) {
  return (st - .5) * r + .5;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  gl_FragColor = texture2D(video, uv) * .3;
}
