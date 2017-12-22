/*{
  "pixelRatio": 1,
  "vertexCount": 0,
  glslify: true,
  audio: true,
  fftSmoothingConstant: 0.4,
  // "vertexMode": "LINES",
  "vertexMode": "LINE_LOOP",
  // "vertexMode": "TRI_FAN",
  // "vertexMode": "POINTS",
  "PASSES": [
    { "TARGET": "renderBuffer", "vs": "./baz.vert"},
    {}
  ],
  "IMPORTED": {
    video: { PATH: "./vj/1.mp4" },
    video2: { PATH: "./vj/3.mp4" }
  }
}*/
precision mediump float;
uniform float time;
uniform float volume;
uniform vec2 resolution;
uniform sampler2D renderBuffer;
uniform sampler2D backbuffer;
uniform sampler2D video;
uniform sampler2D video2;

const float PI = 3.1415926535897932384626433;
vec2 map(vec3 p);
#pragma glslify: rotate = require(./util/rotate.glsl)
#pragma glslify: camera = require('glsl-camera-ray')
#pragma glslify: square = require('glsl-square-frame')
#pragma glslify: raytrace = require('glsl-raytrace', map = map, steps = 30)
#pragma glslify: sdBox = require('glsl-sdf-primitives/sdBox')

vec2 map (vec3 p) {
  p.xz = rotate(p.xz, time + sin(time));
  return vec2(sdBox(p, vec3(2)), 1.);
}

vec3 ray(in vec2 p) {
  vec3 rayOrigin = vec3(0, 0, 5.);
  vec3 rayTarget = vec3(-3., -3., 0);
  vec3 rayDirection = camera(rayOrigin, rayTarget, p, 1.1);
  rayDirection.xy = rotate(rayDirection.xy, time);
  rayDirection.x += sin(time*.2) * .1;
  rayDirection.y += sin(time*.1) * .1;

  vec2 collision = raytrace(rayOrigin, rayDirection);

  if (collision.x > -0.5) {
    vec3 pos = rayOrigin + rayDirection * collision.x;
    return pos;
  }
  return vec3(0);
}

vec2 scale(in vec2 st, in float r) {
  return (st - .5) * r + .5;
}

vec4 dis(in vec2 st, in sampler2D src, in sampler2D dst, in float factor) {
  vec4 map = texture2D(src, st);
  vec2 d = vec2(length(map.r), length(map.g)) * sin(map.b + time + volume);
  return texture2D(dst, fract(st + d * factor));
}

float pulse(in float t) {
  return pow(1. - fract(t), 3.);
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 uv0 = uv;
  // uv = abs(uv - .5);

  // uv = scale(uv, .8);

  float f = mod(volume*2., .8);
  if (f < .91) {
    uv = abs(uv - .5);
    uv += volume * .003;
  }
  // else if (f < .6) {
  //   // float l = length(uv - .5);
  //   // uv = rotate(uv - .5, time + l * volume * .04) + .5;
  // }
  else {
    uv = (uv - .5) * (uv - .5) + .5;
    // uv = scale(uv, 1. / mod(volume * 2., 1.2));
    // uv = rotate(uv - .5, time + volume * 0.00001) + .5;
    // uv = abs(uv - .5) + .5;
  }

  gl_FragColor = texture2D(renderBuffer, uv) * 2.;
  // gl_FragColor.r = texture2D(backbuffer, uv0 + volume * .0001).b;
  gl_FragColor.r = texture2D(renderBuffer, uv + volume * .00001).b;


  // if (fract(volume) > .9) {
  //   gl_FragColor += dis(uv, video, renderBuffer, 0.1);
  //   gl_FragColor = 1. - gl_FragColor;
  //   // gl_FragColor.gb = vec2(.8 - texture2D(backbuffer, uv0).r);
  // }


  vec3 pos = ray(abs(p));
  // gl_FragColor += dis(fract(pos.xy * fract(time) *0.2 - .4), video, renderBuffer, .1) *.2;
  gl_FragColor.a = 1.;



  gl_FragColor /= dis(uv0, backbuffer, backbuffer, 0.1) *.4;
  // gl_FragColor += texture2D(backbuffer, uv0) *.7;

  // gl_FragColor = fract(time+ gl_FragColor);
}
