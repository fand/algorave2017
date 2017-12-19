/*{
  "pixelRatio": 0.5,
  "vertexCount": 1000,
  // "vertexMode": "POINTS",
  // "vertexMode": "LINE_LOOP",
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
  float id = vertexId + sin(time * .2 + vertexId);
  float ux = floor(id / 6.) + mod(id, 2.);
  float vy = mod(floor(id / 2.) + floor(id / 3.), 2.);

  vec3 pos = vec3(
    ux * .02 + sin(id * time * .003) * .01,
    vy * .02 + sin(id + time * .002) * .02,
    1.
  );

  float r = vy;
  r += (sin(time + vertexId * .0003) + sin(ux * 3. + time)) * .7;
  pos.x = cos(ux) * r;
  pos.y = sin(ux) * r;

  pos.xy += vec2(
    random(vec2(floor(id / 30.))) - .5,
    random(vec2(floor(id / 6.))) - .5
  ) * .6;

  pos *= .25;
  pos.y *= resolution.x / resolution.y;

  gl_Position = vec4(pos, 1);
  gl_PointSize = 3.;

  float c = step(0., sin(id * 20. + time * .001));
  v_color = vec4(c, c , c, 1.);
}
