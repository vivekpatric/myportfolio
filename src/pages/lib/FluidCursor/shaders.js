export const baseVertex = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }`;

export const splatShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }`;

export const advectionShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;
  void main () {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    gl_FragColor = dissipation * texture2D(uSource, coord);
    gl_FragColor.a = 1.0;
  }`;

export const divergenceShader = `
  precision mediump float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }`;

export const curlShader = `
  precision mediump float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }`;

export const vorticityShader = `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 vel = texture2D(uVelocity, vUv).xy;
    gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
  }`;

export const pressureShader = `
  precision mediump float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }`;

export const gradientSubtractShader = `
  precision mediump float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }`;

export const clearShader = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }`;

export const displayShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec3 inkColor;
  uniform float threshold;
  uniform float softness;
  void main () {
    vec3 c = texture2D(uTexture, vUv).rgb;
    float intensity = max(c.r, max(c.g, c.b));
    float alpha = smoothstep(threshold - softness, threshold + softness, intensity);
    gl_FragColor = vec4(inkColor * alpha, alpha);   // premultiplied
  }`;
// export const baseVertex = `
//   precision highp float;
//   attribute vec2 aPosition;
//   varying vec2 vUv;
//   varying vec2 vL;
//   varying vec2 vR;
//   varying vec2 vT;
//   varying vec2 vB;
//   uniform vec2 texelSize;
//   void main () {
//     vUv = aPosition * 0.5 + 0.5;
//     vL = vUv - vec2(texelSize.x, 0.0);
//     vR = vUv + vec2(texelSize.x, 0.0);
//     vT = vUv + vec2(0.0, texelSize.y);
//     vB = vUv - vec2(0.0, texelSize.y);
//     gl_Position = vec4(aPosition, 0.0, 1.0);
//   }`;

// // export const splatShader = `
// //   precision highp float;
// //   varying vec2 vUv;
// //   uniform sampler2D uTarget;
// //   uniform float aspectRatio;
// //   uniform vec3 color;
// //   uniform vec2 point;
// //   uniform float radius;
// //   uniform float maxValue;
// //   void main () {
// //     vec2 p = vUv - point.xy;
// //     p.x *= aspectRatio;
// //     vec3 splat = exp(-dot(p, p) / radius) * color;
// //     vec3 base = texture2D(uTarget, vUv).xyz;
// //     gl_FragColor = vec4(min(base + splat, vec3(maxValue)), 1.0);
// //   }`;
// export const splatShader = `
//   precision highp float;
//   varying vec2 vUv;
//   uniform sampler2D uTarget;
//   uniform float aspectRatio;
//   uniform vec3 color;
//   uniform vec2 pointA;   // where the streak starts (previous cursor position)
//   uniform vec2 pointB;   // where it ends (the tip, ahead of the cursor)
//   uniform float radius;
//   uniform float taper;   // 0 = even width, 1 = ends in a needle tip
//   uniform float maxValue;
//   void main () {
//     vec2 pa = (vUv - pointA) * vec2(aspectRatio, 1.0);
//     vec2 ba = (pointB - pointA) * vec2(aspectRatio, 1.0);
//     float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.000001), 0.0, 1.0);
//     vec2 d = pa - ba * h;
//     float r = max(radius * (1.0 - taper * h), 0.000001);
//     vec3 splat = exp(-dot(d, d) / r) * color;
//     vec3 base = texture2D(uTarget, vUv).xyz;
//     gl_FragColor = vec4(min(base + splat, vec3(maxValue)), 1.0);
//   }`;
// export const advectionShader = `
//   precision highp float;
//   varying vec2 vUv;
//   uniform sampler2D uVelocity;
//   uniform sampler2D uSource;
//   uniform vec2 texelSize;
//   uniform float dt;
//   uniform float dissipation;
//   void main () {
//     vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
//     gl_FragColor = dissipation * texture2D(uSource, coord);
//     gl_FragColor.a = 1.0;
//   }`;

// export const divergenceShader = `
//   precision mediump float;
//   varying vec2 vUv;
//   varying vec2 vL;
//   varying vec2 vR;
//   varying vec2 vT;
//   varying vec2 vB;
//   uniform sampler2D uVelocity;
//   void main () {
//     float L = texture2D(uVelocity, vL).x;
//     float R = texture2D(uVelocity, vR).x;
//     float T = texture2D(uVelocity, vT).y;
//     float B = texture2D(uVelocity, vB).y;
//     vec2 C = texture2D(uVelocity, vUv).xy;
//     if (vL.x < 0.0) { L = -C.x; }
//     if (vR.x > 1.0) { R = -C.x; }
//     if (vT.y > 1.0) { T = -C.y; }
//     if (vB.y < 0.0) { B = -C.y; }
//     float div = 0.5 * (R - L + T - B);
//     gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
//   }`;

// export const curlShader = `
//   precision mediump float;
//   varying vec2 vUv;
//   varying vec2 vL;
//   varying vec2 vR;
//   varying vec2 vT;
//   varying vec2 vB;
//   uniform sampler2D uVelocity;
//   void main () {
//     float L = texture2D(uVelocity, vL).y;
//     float R = texture2D(uVelocity, vR).y;
//     float T = texture2D(uVelocity, vT).x;
//     float B = texture2D(uVelocity, vB).x;
//     float vorticity = R - L - T + B;
//     gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
//   }`;

// export const vorticityShader = `
//   precision highp float;
//   varying vec2 vUv;
//   varying vec2 vL;
//   varying vec2 vR;
//   varying vec2 vT;
//   varying vec2 vB;
//   uniform sampler2D uVelocity;
//   uniform sampler2D uCurl;
//   uniform float curl;
//   uniform float dt;
//   void main () {
//     float L = texture2D(uCurl, vL).x;
//     float R = texture2D(uCurl, vR).x;
//     float T = texture2D(uCurl, vT).x;
//     float B = texture2D(uCurl, vB).x;
//     float C = texture2D(uCurl, vUv).x;
//     vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
//     force /= length(force) + 0.0001;
//     force *= curl * C;
//     force.y *= -1.0;
//     vec2 vel = texture2D(uVelocity, vUv).xy;
//     gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
//   }`;

// export const pressureShader = `
//   precision mediump float;
//   varying vec2 vUv;
//   varying vec2 vL;
//   varying vec2 vR;
//   varying vec2 vT;
//   varying vec2 vB;
//   uniform sampler2D uPressure;
//   uniform sampler2D uDivergence;
//   void main () {
//     float L = texture2D(uPressure, vL).x;
//     float R = texture2D(uPressure, vR).x;
//     float T = texture2D(uPressure, vT).x;
//     float B = texture2D(uPressure, vB).x;
//     float divergence = texture2D(uDivergence, vUv).x;
//     float pressure = (L + R + B + T - divergence) * 0.25;
//     gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
//   }`;

// export const gradientSubtractShader = `
//   precision mediump float;
//   varying vec2 vUv;
//   varying vec2 vL;
//   varying vec2 vR;
//   varying vec2 vT;
//   varying vec2 vB;
//   uniform sampler2D uPressure;
//   uniform sampler2D uVelocity;
//   void main () {
//     float L = texture2D(uPressure, vL).x;
//     float R = texture2D(uPressure, vR).x;
//     float T = texture2D(uPressure, vT).x;
//     float B = texture2D(uPressure, vB).x;
//     vec2 velocity = texture2D(uVelocity, vUv).xy;
//     velocity.xy -= vec2(R - L, T - B);
//     gl_FragColor = vec4(velocity, 0.0, 1.0);
//   }`;

// export const clearShader = `
//   precision mediump float;
//   varying vec2 vUv;
//   uniform sampler2D uTexture;
//   uniform float value;
//   void main () {
//     gl_FragColor = value * texture2D(uTexture, vUv);
//   }`;

// // export const displayShader = `
// //   precision highp float;
// //   varying vec2 vUv;
// //   uniform sampler2D uTexture;
// //   uniform vec3 inkColor;
// //   uniform float threshold;
// //   uniform float softness;
// //   void main () {
// //     vec3 c = texture2D(uTexture, vUv).rgb;
// //     float intensity = max(c.r, max(c.g, c.b));
// //     float alpha = smoothstep(threshold - softness, threshold + softness, intensity);
// //     gl_FragColor = vec4(inkColor * alpha, alpha);   // premultiplied
// //   }`;
// export const displayShader = `
//   precision highp float;
//   varying vec2 vUv;
//   uniform sampler2D uTexture;
//   uniform vec3 inkColor;
//   uniform float threshold;
//   uniform float softness;
//   uniform float aspect;
//   uniform float noiseAmount;
//   uniform float noiseScale;
//   uniform float noiseStretch;

//   float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
//   float noise(vec2 p) {
//     vec2 i = floor(p), f = fract(p);
//     f = f * f * (3.0 - 2.0 * f);
//     return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
//                mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
//   }
//   float fbm(vec2 p) {
//     float v = 0.0, a = 0.5;
//     for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
//     return v;
//   }

//   void main () {
//     vec3 c = texture2D(uTexture, vUv).rgb;
//     float intensity = max(c.r, max(c.g, c.b));
//     // noise stretched vertically = spikes and drips hanging down
//     vec2 p = vec2(vUv.x * aspect, vUv.y * noiseStretch) * noiseScale;
//     float n = fbm(p) - 0.47;
//     // only roughen where there is ink, so no specks on empty areas
//     intensity += n * noiseAmount * smoothstep(0.0, 0.15, intensity);
//     float alpha = smoothstep(threshold - softness, threshold + softness, intensity);
//     gl_FragColor = vec4(inkColor * alpha, alpha);   // premultiplied
//   }`;