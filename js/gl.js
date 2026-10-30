/* Hero particle sculpture — raw WebGL, no dependencies.
   One point cloud morphs between four shapes drawn from the lab's logo:
   a Vibrio cell, a helix, a network and a horseshoe crab. */
window.VistaGL = (function () {
  'use strict';

  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const TAU = Math.PI * 2;

  function rotZ(p, a) { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; }
  function rotX(p, a) { const c = Math.cos(a), s = Math.sin(a); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; }

  // ── Shapes ────────────────────────────────────────────────────────────
  function vibrio(n, R) {
    const out = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      let p;
      if (R() < 0.76) {
        const s = R() * 2 - 1;
        const cx = s * 0.85, cy = -0.3 * s * s + 0.1;
        let tx = 0.85, ty = -0.6 * s; const l = Math.hypot(tx, ty); tx /= l; ty /= l;
        let rad = 0.3; const a = Math.abs(s);
        if (a > 0.68) { const k = (a - 0.68) / 0.32; rad *= Math.sqrt(Math.max(0, 1 - k * k)); }
        const th = R() * TAU, shell = R() < 0.85 ? 1 : R();
        p = [cx - ty * Math.cos(th) * rad * shell, cy + tx * Math.cos(th) * rad * shell, Math.sin(th) * rad * shell];
      } else {
        const t = R(), amp = 0.05 + 0.1 * t, j = 0.012;
        p = [0.85 + t * 1.15, -0.2 - t * 0.12 + amp * Math.sin(t * 17), amp * Math.cos(t * 17)];
        p[0] += (R() - 0.5) * j; p[1] += (R() - 0.5) * j; p[2] += (R() - 0.5) * j;
      }
      p[0] -= 0.5;
      p = rotZ(p, 0.42);
      out.set([p[0] * 0.95, p[1] * 0.95, p[2] * 0.95], i * 3);
    }
    return out;
  }

  function helix(n, R) {
    const out = new Float32Array(n * 3), turns = 3.1, rad = 0.44, H = 2.3;
    for (let i = 0; i < n; i++) {
      let p; const r = R();
      if (r < 0.66) {
        const k = R() < 0.5 ? 0 : Math.PI, t = R(), a = t * TAU * turns + k;
        const j = 0.05; p = [rad * Math.cos(a) + (R() - 0.5) * j, (t - 0.5) * H + (R() - 0.5) * j, rad * Math.sin(a) + (R() - 0.5) * j];
      } else {
        const t = Math.floor(R() * 20) / 20 + 0.025, a = t * TAU * turns, u = (R() * 2 - 1) * 0.92;
        p = [rad * Math.cos(a) * u, (t - 0.5) * H + (R() - 0.5) * 0.012, rad * Math.sin(a) * u];
      }
      p = rotZ(p, 0.5);
      out.set(p, i * 3);
    }
    return out;
  }

  function network(n, R) {
    const M = 74, nodes = [], edges = [];
    for (let i = 0; i < M; i++) {
      const y = 1 - (i / (M - 1)) * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996, k = 0.62 + 0.36 * R();
      nodes.push([Math.cos(a) * r * k, y * k, Math.sin(a) * r * k, R() < 0.18 ? 0.075 : 0.035]);
    }
    for (let i = 0; i < M; i++) {
      const d = nodes.map((q, j) => [Math.hypot(q[0] - nodes[i][0], q[1] - nodes[i][1], q[2] - nodes[i][2]), j]).sort((a, b) => a[0] - b[0]);
      for (let k = 1; k <= 3; k++) edges.push([i, d[k][1]]);
    }
    const out = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      let p;
      if (R() < 0.34) {
        const q = nodes[(R() * M) | 0], u = R() * 2 - 1, th = R() * TAU, s = Math.sqrt(1 - u * u), rr = q[3] * Math.cbrt(R());
        p = [q[0] + rr * s * Math.cos(th), q[1] + rr * u, q[2] + rr * s * Math.sin(th)];
      } else {
        const e = edges[(R() * edges.length) | 0], a = nodes[e[0]], b = nodes[e[1]], t = R(), j = 0.006;
        p = [a[0] + (b[0] - a[0]) * t + (R() - 0.5) * j, a[1] + (b[1] - a[1]) * t + (R() - 0.5) * j, a[2] + (b[2] - a[2]) * t + (R() - 0.5) * j];
      }
      out.set([p[0] * 1.08, p[1] * 1.08, p[2] * 1.08], i * 3);
    }
    return out;
  }

  function crab(n, R) {
    const out = new Float32Array(n * 3);
    const PR = 0.8, PC = [0, 0.1];
    const carved = (x, y) => Math.hypot(x, y + 0.86) < 0.7;
    const dome = (x, y) => 0.4 * Math.sqrt(Math.max(0, 1 - Math.pow(Math.hypot(x - PC[0], y - PC[1]) / PR, 2)));
    for (let i = 0; i < n; i++) {
      let p; const r = R();
      if (r < 0.42) {                               // prosoma dome
        let x, y;
        do { const a = R() * TAU, d = Math.sqrt(R()) * PR; x = PC[0] + Math.cos(a) * d; y = PC[1] + Math.sin(a) * d; } while (carved(x, y));
        p = [x, y, dome(x, y)];
      } else if (r < 0.54) {                        // prosoma rim + carved back edge
        let x, y;
        if (R() < 0.7) { do { const a = R() * TAU; x = PC[0] + Math.cos(a) * PR; y = PC[1] + Math.sin(a) * PR; } while (carved(x, y)); }
        else { do { const a = R() * Math.PI; x = Math.cos(a) * 0.7; y = -0.86 + Math.sin(a) * 0.7; } while (Math.hypot(x - PC[0], y - PC[1]) > PR); }
        p = [x, y, dome(x, y) * 0.5];
      } else if (r < 0.6) {                         // ridges
        const k = (R() * 3 | 0) - 1, t = R();
        const x = k * (0.3 + 0.1 * Math.sin(t * Math.PI)), y = -0.12 + t * 0.78;
        p = [x, y, dome(x, y) + 0.015];
      } else if (r < 0.64) {                        // compound eyes
        const k = R() < 0.5 ? -1 : 1, a = R() * TAU, d = R() * 0.045;
        const x = k * 0.46 + Math.cos(a) * d, y = 0.16 + Math.sin(a) * d * 1.6;
        p = [x, y, dome(x, y) + 0.03];
      } else if (r < 0.84) {                        // opisthosoma
        const a = R() * TAU, d = Math.sqrt(R());
        let x = Math.cos(a) * d * 0.44, y = -0.62 + Math.sin(a) * d * 0.44;
        const back = Math.max(0, (-y - 0.3) / 0.76);
        x *= 1 - 0.42 * back;
        p = [x, y, 0.24 * Math.sqrt(Math.max(0, 1 - d * d)) + 0.02];
      } else if (r < 0.9) {                         // marginal spines
        const k = R() < 0.5 ? -1 : 1, s = ((R() * 6) | 0) / 6, t = R();
        const y0 = -0.42 - s * 0.52, x0 = k * (0.42 - s * 0.2);
        p = [x0 + k * t * 0.13, y0 - t * 0.09, 0.03];
      } else {                                      // telson
        const t = R(), w = 0.035 * (1 - t), a = R() * TAU;
        p = [Math.cos(a) * w, -1.02 - t * 1.2, 0.05 + Math.sin(a) * w];
      }
      p[1] += 0.62;
      p = rotX(p, -0.4); p = rotZ(p, 0.5);
      out.set([p[0] * 0.86, p[1] * 0.86, p[2] * 0.86], i * 3);
    }
    return out;
  }

  // ── GL ────────────────────────────────────────────────────────────────
  const VERT = `
attribute vec3 aA; attribute vec3 aB; attribute vec4 aR;
uniform float uMix, uTime, uAspect, uScale, uPx, uFade;
uniform vec2 uRot, uOffset, uMouse;
varying float vAlpha; varying float vTone;
void main(){
  float m = clamp((uMix - aR.x * 0.4) / 0.6, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);
  vec3 p = mix(aA, aB, m);
  float burst = sin(m * 3.14159265);
  p += normalize(aR.yzw - 0.5) * burst * 0.6 * (0.25 + aR.x);
  float sw = burst * 1.6 * (aR.y - 0.5);
  p.xz = mat2(cos(sw), -sin(sw), sin(sw), cos(sw)) * p.xz;
  p += 0.012 * vec3(sin(uTime * 1.3 + aR.y * 40.0), cos(uTime * 1.1 + aR.z * 40.0), sin(uTime * 0.9 + aR.w * 40.0));
  float cy = cos(uRot.x), sy = sin(uRot.x), cx = cos(uRot.y), sx = sin(uRot.y);
  p = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
  p = vec3(p.x, p.y * cx - p.z * sx, p.y * sx + p.z * cx);
  float persp = 1.0 / (1.0 - p.z * 0.3);
  vec2 xy = p.xy * persp * uScale;
  xy.x /= uAspect;
  xy += uOffset;
  vec2 d = xy - uMouse; d.x *= uAspect;
  float f = exp(-dot(d, d) * 16.0);
  xy += normalize(d + 1e-4) * f * 0.07 * vec2(1.0 / uAspect, 1.0);
  gl_Position = vec4(xy, 0.0, 1.0);
  gl_PointSize = uPx * (1.5 + aR.w * 2.5) * persp * (1.0 + burst * 0.9 + f * 1.5);
  vAlpha = (0.5 + 0.5 * aR.z) * smoothstep(-1.4, 0.9, p.z) * uFade;
  vTone = aR.y;
}`;
  const FRAG = `
precision mediump float;
uniform vec3 uC1, uC2;
varying float vAlpha; varying float vTone;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d) * vAlpha;
  gl_FragColor = vec4(mix(uC1, uC2, vTone) * a, a);
}`;

  const PALETTE = [
    [[0.37, 0.95, 0.84], [0.28, 0.78, 1.0]],   // Vibrio — bioluminescent teal
    [[0.28, 0.78, 1.0], [0.72, 0.62, 1.0]],    // Structure — aqua / violet
    [[0.85, 0.97, 1.0], [0.37, 0.95, 0.84]],   // Analysis — white / teal
    [[1.0, 0.70, 0.48], [1.0, 0.86, 0.62]],    // Crab — warm amber
  ];

  function init(canvas) {
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' });
    if (!gl) return null;
    const small = Math.min(window.innerWidth, window.innerHeight) < 700;
    const N = small ? 9000 : 17000;
    const shapes = [vibrio(N, rng(11)), helix(N, rng(23)), network(N, rng(37)), crab(N, rng(53))];
    const rand = new Float32Array(N * 4), R = rng(7);
    for (let i = 0; i < N * 4; i++) rand[i] = R();

    function sh(type, src) {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);
    const U = {};
    ['uMix', 'uTime', 'uAspect', 'uScale', 'uPx', 'uFade', 'uRot', 'uOffset', 'uMouse', 'uC1', 'uC2'].forEach(n => U[n] = gl.getUniformLocation(prog, n));

    function attr(name, size, data) {
      const b = gl.createBuffer(), loc = gl.getAttribLocation(prog, name);
      gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      return b;
    }
    const bufA = attr('aA', 3, shapes[0]), bufB = attr('aB', 3, shapes[1]);
    attr('aR', 4, rand);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 0);

    let seg = 0, dpr = 1, w = 1, h = 1;
    const state = { t: 0, mouse: [9, 9], rot: [0, 0], offset: [0, 0], scale: 0.62, fade: 1 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      const wide = w / h > 1.05;
      state.offset = wide ? [0.36, 0.04] : [0, 0.22];
      state.scale = wide ? 0.64 : 0.42 * Math.min(1, (w / h) / 0.5);
    }
    resize();

    const mixc = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];

    function render(time) {
      const t = Math.max(0, Math.min(2.9999, state.t)), s = Math.floor(t), f = t - s;
      if (s !== seg) {
        seg = s;
        gl.bindBuffer(gl.ARRAY_BUFFER, bufA); gl.bufferSubData(gl.ARRAY_BUFFER, 0, shapes[s]);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufB); gl.bufferSubData(gl.ARRAY_BUFFER, 0, shapes[s + 1]);
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(U.uMix, f); gl.uniform1f(U.uTime, time);
      gl.uniform1f(U.uAspect, w / h); gl.uniform1f(U.uScale, state.scale);
      gl.uniform1f(U.uPx, dpr * (h / 900)); gl.uniform1f(U.uFade, state.fade);
      gl.uniform2f(U.uRot, state.rot[0], state.rot[1]);
      gl.uniform2f(U.uOffset, state.offset[0], state.offset[1]);
      gl.uniform2f(U.uMouse, state.mouse[0], state.mouse[1]);
      const c1 = mixc(PALETTE[s][0], PALETTE[s + 1][0], f), c2 = mixc(PALETTE[s][1], PALETTE[s + 1][1], f);
      gl.uniform3f(U.uC1, c1[0], c1[1], c1[2]); gl.uniform3f(U.uC2, c2[0], c2[1], c2[2]);
      gl.drawArrays(gl.POINTS, 0, N);
    }
    return { state, render, resize };
  }

  return { init };
})();
