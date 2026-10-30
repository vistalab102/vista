/* Generative canvas scenes for the four research panels.
   Each factory returns draw(time) and is only called while its panel is on screen. */
window.VistaScenes = (function () {
  'use strict';
  const TAU = Math.PI * 2;
  const ACC = '94,242,214', AQUA = '72,199,255', INK = '233,242,241', WARM = '255,179,122';

  function rng(seed) { return () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296; }
  const ease = t => t * t * (3 - 2 * t);

  function setup(canvas) {
    const ctx = canvas.getContext('2d');
    const s = { ctx, w: 1, h: 1 };
    s.fit = function () {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      s.w = w; s.h = h;
    };
    return s;
  }
  const label = (ctx, text, x, y, a) => {
    ctx.font = '500 10px "JetBrains Mono", monospace'; ctx.fillStyle = `rgba(${INK},${a || 0.45})`; ctx.fillText(text, x, y);
  };

  // 1 ── A chain that folds into a helical bundle, with a live contact map.
  function fold(canvas) {
    const s = setup(canvas), n = 72, seg = n / 3;
    const A = [], B = [];
    for (let i = 0; i < n; i++) {
      A.push([(i / (n - 1) - 0.5) * 2.6, Math.sin(i * 0.9) * 0.1, Math.cos(i * 0.9) * 0.1]);
      const k = Math.floor(i / seg), j = (i % seg) / (seg - 1), dir = k % 2 ? -1 : 1;
      B.push([(k - 1) * 0.62 + 0.2 * Math.cos(i * 1.745), dir * (j - 0.5) * 1.5, 0.2 * Math.sin(i * 1.745) + (k === 1 ? 0.25 : 0)]);
    }
    const P = new Array(n);
    return function (t) {
      s.fit(); const { ctx, w, h } = s;
      ctx.clearRect(0, 0, w, h);
      const cyc = (t * 0.11) % 1;
      const m = ease(Math.min(1, Math.max(0, cyc < 0.5 ? (cyc - 0.08) / 0.3 : (0.92 - cyc) / 0.3)));
      const ry = t * 0.35, cy = Math.cos(ry), sy = Math.sin(ry), sc = Math.min(w, h) * 0.3, ox = w * 0.5, oy = h * 0.52;
      for (let i = 0; i < n; i++) {
        const st = ease(Math.min(1, Math.max(0, m * 1.6 - (i / n) * 0.6)));
        const x = A[i][0] + (B[i][0] - A[i][0]) * st, y = A[i][1] + (B[i][1] - A[i][1]) * st, z = A[i][2] + (B[i][2] - A[i][2]) * st;
        const X = x * cy + z * sy, Z = -x * sy + z * cy, p = 1 / (1 - Z * 0.25);
        P[i] = [ox + X * sc * p, oy - y * sc * p, Z, x, y, z];
      }
      ctx.lineCap = 'round';
      for (let i = 1; i < n; i++) {
        const a = P[i - 1], b = P[i], d = (a[2] + b[2]) * 0.5, f = i / n;
        ctx.strokeStyle = `rgba(${Math.round(72 + 110 * f)},${Math.round(199 - 40 * f)},${Math.round(255 - 30 * f)},${0.35 + 0.5 * (d + 1) / 2})`;
        ctx.lineWidth = 1.5 + (d + 1) * 1.6;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
      const hot = Math.floor((t * 14) % n);
      for (let i = 0; i < n; i += 2) {
        const p = P[i], near = Math.abs(i - hot) < 3;
        ctx.fillStyle = near ? `rgba(${ACC},1)` : `rgba(${INK},${0.4 + 0.4 * (p[2] + 1) / 2})`;
        ctx.beginPath(); ctx.arc(p[0], p[1], near ? 4.5 : 1.8 + (p[2] + 1), 0, TAU); ctx.fill();
      }
      // contact map
      const g = 18, cs = Math.max(4, Math.min(8, w / 70)), mx = w - g * cs - 20, my = 20;
      for (let i = 0; i < g; i++) for (let j = 0; j < g; j++) {
        const a = P[i * 4], b = P[j * 4], d = Math.hypot(a[3] - b[3], a[4] - b[4], a[5] - b[5]);
        const v = i === j ? 1 : Math.max(0, 1 - d / 0.75);
        ctx.fillStyle = `rgba(${ACC},${0.06 + v * 0.85})`;
        ctx.fillRect(mx + i * cs, my + j * cs, cs - 1, cs - 1);
      }
      label(ctx, 'CONTACT MAP', mx, my + g * cs + 14);
      label(ctx, m > 0.5 ? 'STATE · FOLDED' : 'STATE · UNFOLDED', 18, 28, 0.6);
    };
  }

  // 2 ── A mass spectrum that keeps re-acquiring.
  function spectrum(canvas) {
    const s = setup(canvas), R = rng(91), n = 64, peaks = [];
    for (let i = 0; i < n; i++) peaks.push({ x: 0.03 + R() * 0.94, h: 0, to: 0, mz: 0 });
    peaks.sort((a, b) => a.x - b.x);
    peaks.forEach(p => p.mz = 400 + p.x * 1200);
    let scan = -1;
    function acquire() { peaks.forEach(p => { const r = R(); p.to = r < 0.12 ? 0.55 + R() * 0.45 : r * r * 0.4; }); }
    return function (t) {
      s.fit(); const { ctx, w, h } = s;
      const k = Math.floor(t / 3.2); if (k !== scan) { scan = k; acquire(); }
      ctx.clearRect(0, 0, w, h);
      const L = 44, Rt = w - 22, T = 46, B = h - 52, W = Rt - L, H = B - T;
      ctx.strokeStyle = `rgba(${INK},.1)`; ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) { const y = B - H * i / 4; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(Rt, y); ctx.stroke(); label(ctx, String(i * 25), 14, y + 3, 0.35); }
      for (let i = 0; i <= 6; i++) { const x = L + W * i / 6; ctx.beginPath(); ctx.moveTo(x, B); ctx.lineTo(x, B + 6); ctx.stroke(); label(ctx, String(400 + i * 200), x - 10, B + 20, 0.35); }
      const sweep = (t / 3.2) % 1, sx = L + W * sweep;
      const top = peaks.slice().sort((a, b) => b.h - a.h).slice(0, 5);
      peaks.forEach(p => {
        const live = p.x < sweep ? p.to : p.h; p.h += (live - p.h) * 0.12;
        const x = L + W * p.x, y = B - H * p.h, big = top.includes(p) && p.h > 0.3;
        ctx.strokeStyle = big ? `rgba(${ACC},1)` : `rgba(${AQUA},.75)`; ctx.lineWidth = big ? 2 : 1.3;
        ctx.beginPath(); ctx.moveTo(x, B); ctx.lineTo(x, y); ctx.stroke();
        if (big) {
          ctx.fillStyle = `rgba(${ACC},1)`; ctx.beginPath(); ctx.arc(x, y, 3, 0, TAU); ctx.fill();
          label(ctx, p.mz.toFixed(1), Math.min(x + 6, Rt - 44), Math.max(y - 6, T), 0.8);
        }
      });
      const gr = ctx.createLinearGradient(sx - 60, 0, sx, 0);
      gr.addColorStop(0, `rgba(${ACC},0)`); gr.addColorStop(1, `rgba(${ACC},.16)`);
      ctx.fillStyle = gr; ctx.fillRect(sx - 60, T, 60, H);
      ctx.strokeStyle = `rgba(${ACC},.8)`; ctx.beginPath(); ctx.moveTo(sx, T); ctx.lineTo(sx, B); ctx.stroke();
      label(ctx, 'RELATIVE INTENSITY', 18, 28, 0.6); label(ctx, 'm/z', Rt - 22, B + 38, 0.6);
      label(ctx, 'SCAN ' + String(scan % 1000).padStart(3, '0'), Rt - 62, 28, 0.6);
    };
  }

  // 3 ── Tide lines and drifting plankton.
  function tide(canvas) {
    const s = setup(canvas), R = rng(5), dots = [];
    for (let i = 0; i < 46; i++) dots.push({ x: R(), y: R(), r: 0.8 + R() * 2.6, s: 0.2 + R() * 0.8, p: R() * TAU });
    return function (t) {
      s.fit(); const { ctx, w, h } = s;
      ctx.clearRect(0, 0, w, h);
      const lines = 22;
      for (let i = 0; i < lines; i++) {
        const f = i / (lines - 1), y0 = h * (0.1 + f * 0.86), amp = 6 + f * 26;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const u = x / w;
          const y = y0 + Math.sin(u * 5 + t * (0.5 + f * 0.5) + i * 0.6) * amp * 0.6 + Math.sin(u * 11 - t * 0.7 + i) * amp * 0.25 + Math.sin(u * 2.2 + t * 0.2) * amp;
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.strokeStyle = `rgba(${i % 5 === 0 ? ACC : AQUA},${0.12 + f * 0.5})`; ctx.lineWidth = i % 5 === 0 ? 1.6 : 1;
        ctx.stroke();
      }
      dots.forEach(d => {
        const x = ((d.x + t * 0.012 * d.s) % 1) * w, y = ((d.y - t * 0.008 * d.s + 10) % 1) * h + Math.sin(t * d.s + d.p) * 8;
        const g = 0.45 + 0.45 * Math.sin(t * 1.5 * d.s + d.p);
        ctx.fillStyle = `rgba(${INK},${g})`; ctx.beginPath(); ctx.arc(x, y, d.r, 0, TAU); ctx.fill();
        ctx.strokeStyle = `rgba(${ACC},${g * 0.35})`; ctx.beginPath(); ctx.arc(x, y, d.r * 3.2, 0, TAU); ctx.stroke();
      });
      label(ctx, 'INTERTIDAL · 15.39°N 73.87°E', 18, 28, 0.6);
    };
  }

  // 4 ── Sinking plastic fragments and the microbes that colonise them.
  function plastic(canvas) {
    const s = setup(canvas), R = rng(77), frags = [], bugs = [];
    const cols = [WARM, '255,122,110', INK, '168,212,255'];
    for (let i = 0; i < 34; i++) {
      const k = 3 + (R() * 4 | 0), pts = [];
      for (let j = 0; j < k; j++) { const a = j / k * TAU + R() * 0.6; pts.push([Math.cos(a) * (0.5 + R() * 0.5), Math.sin(a) * (0.5 + R() * 0.5)]); }
      frags.push({ x: R(), y: R(), r: 6 + R() * 15, a: R() * TAU, va: (R() - 0.5) * 0.6, vy: 0.012 + R() * 0.025, sw: R() * TAU, pts, c: cols[i % cols.length], fill: R() < 0.55 });
    }
    for (let i = 0; i < 120; i++) bugs.push({ x: R(), y: R(), vx: 0, vy: 0 });
    let last = 0;
    return function (t) {
      s.fit(); const { ctx, w, h } = s;
      const dt = Math.min(0.05, Math.max(0, t - last)); last = t;
      ctx.clearRect(0, 0, w, h);
      frags.forEach(f => {
        f.y += f.vy * dt; if (f.y > 1.08) { f.y = -0.08; f.x = R(); }
        f.a += f.va * dt;
        f.px = (f.x + Math.sin(t * 0.4 + f.sw) * 0.02) * w; f.py = f.y * h;
        ctx.save(); ctx.translate(f.px, f.py); ctx.rotate(f.a); ctx.beginPath();
        f.pts.forEach((p, i) => i ? ctx.lineTo(p[0] * f.r, p[1] * f.r) : ctx.moveTo(p[0] * f.r, p[1] * f.r));
        ctx.closePath();
        if (f.fill) { ctx.fillStyle = `rgba(${f.c},.82)`; ctx.fill(); } else { ctx.strokeStyle = `rgba(${f.c},.9)`; ctx.lineWidth = 1.4; ctx.stroke(); }
        ctx.restore();
      });
      ctx.fillStyle = `rgba(${ACC},.9)`;
      bugs.forEach(b => {
        let bx = b.x * w, by = b.y * h, best = 1e9, tg = null;
        for (const f of frags) { const d = (f.px - bx) ** 2 + (f.py - by) ** 2; if (d < best) { best = d; tg = f; } }
        const d = Math.sqrt(best) || 1, pull = d > tg.r * 1.3 ? 26 : -30;
        b.vx += ((tg.px - bx) / d * pull + (R() - 0.5) * 160) * dt; b.vy += ((tg.py - by) / d * pull + (R() - 0.5) * 160) * dt;
        b.vx *= 0.94; b.vy *= 0.94;
        bx += b.vx * dt; by += b.vy * dt; b.x = bx / w; b.y = by / h;
        ctx.beginPath(); ctx.arc(bx, by, 1.5, 0, TAU); ctx.fill();
      });
      label(ctx, 'WATER COLUMN · PARTICLES < 5 MM', 18, 28, 0.6);
    };
  }

  // Dotted globe for the contact section (kept from the previous site, redrawn).
  function globe(canvas) {
    const s = setup(canvas), N = 900, dots = [];
    for (let i = 0; i < N; i++) dots.push([Math.acos(-1 + (2 * i + 1) / N), Math.sqrt(N * Math.PI) * Math.acos(-1 + (2 * i + 1) / N)]);
    return function (t) {
      s.fit(); const { ctx, w, h } = s;
      ctx.clearRect(0, 0, w, h);
      const Rr = Math.min(w, h) * 0.42, a = t * 0.12, tilt = 0.4, ct = Math.cos(tilt), st = Math.sin(tilt);
      for (const d of dots) {
        const x = Rr * Math.sin(d[0]) * Math.cos(d[1] + a), z0 = Rr * Math.sin(d[0]) * Math.sin(d[1] + a), y0 = Rr * Math.cos(d[0]);
        const y = y0 * ct - z0 * st, z = y0 * st + z0 * ct, k = (z / Rr + 1) / 2;
        ctx.fillStyle = `rgba(${ACC},${0.05 + k * 0.6})`;
        ctx.beginPath(); ctx.arc(w / 2 + x, h / 2 - y, 0.5 + k * 1.5, 0, TAU); ctx.fill();
      }
      // Goa marker
      const lat = 15.39 * Math.PI / 180, lon = t * 0.12 + 1.2;
      const gx = Rr * Math.cos(lat) * Math.cos(lon), gz0 = Rr * Math.cos(lat) * Math.sin(lon), gy0 = Rr * Math.sin(lat);
      const gy = gy0 * ct - gz0 * st, gz = gy0 * st + gz0 * ct;
      if (gz > 0) {
        const px = w / 2 + gx, py = h / 2 - gy, pulse = (t * 0.7) % 1;
        ctx.fillStyle = `rgba(${WARM},1)`; ctx.beginPath(); ctx.arc(px, py, 4, 0, TAU); ctx.fill();
        ctx.strokeStyle = `rgba(${WARM},${1 - pulse})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(px, py, 4 + pulse * 22, 0, TAU); ctx.stroke();
        label(ctx, 'GOA', px + 12, py + 4, 0.9);
      }
    };
  }

  return { fold, spectrum, tide, plastic, globe };
})();
