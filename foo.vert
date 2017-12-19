/*{
  "pixelRatio": 1,
  "vertexCount": 500,
  // "vertexMode": "TRIANGLE",
  // "vertexMode": "TRIANGLE",
}*/
precision mediump float;
attribute float vertexId;
uniform float vertexCount;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
varying vec4 v_color;

float random (in vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise (in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = smoothstep(0., 1., f);
  return mix(a, b, u.x) +
    (c - a)* u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

void main() {
  float t = time * .05;
  float i = floor(vertexId * .3 + sin(time * .3) * 3.) * .2 + sin(vertexId) * .5;

  vec3 pos = vec3(
    sin(t + vertexId) * cos(i + time * .5),
    cos(t + vertexId) * cos(i + time * .5),
    noise(vec2(i))
  ) * .5;

  gl_Position = vec4(pos.x, pos.y * resolution.x / resolution.y, pos.z * .1, 1);
  gl_PointSize = .4 / max(abs(pos.z), .1);

  v_color = vec4(
    fract(i *.2) * .9
  );
  v_color.a = 1.;
}
