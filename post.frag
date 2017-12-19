/*{
  "pixelRatio": 1,
  "vertexCount": 50,
  glslify: true,
  audio: true,
  // "vertexMode": "LINES",
  "vertexMode": "LINE_LOOP",
  // "vertexMode": "TRI_FAN",
  // "vertexMode": "POINTS",
  "PASSES": [
    { "TARGET": "renderBuffer", "vs": "./foo.vert"},
    {}
  ],
  "IMPORTED": {
    video: { PATH: "./vj/10.mp4" }
  }
}*/
precision mediump float;
uniform float time;
uniform float volume;
uniform vec2 resolution;
uniform sampler2D renderBuffer;
uniform sampler2D backbuffer;
uniform sampler2D video;
#pragma glslify: rotate = require(./util/rotate.glsl)

vec2 scale(in vec2 st, in float r) {
  return (st - .5) * r + .5;
}

vec4 dis(in vec2 st, in sampler2D src, in sampler2D dst, in float factor) {
  vec4 map = texture2D(src, st);
  vec2 d = vec2(length(map.r), length(map.g)) * sin(map.b + time + volume);
  return texture2D(dst, fract(st + d * factor));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 uv0 = uv;
  uv = abs(uv - .5);

  gl_FragColor = texture2D(renderBuffer, uv);
  gl_FragColor.r = texture2D(backbuffer, uv0 + .003).b;

  // gl_FragColor = dis(uv, video, renderBuffer, .1);
}
