/* ViStA Lab — page logic: content rendering, scroll choreography, interactions. */
(function () {
  'use strict';
  const V = window.VISTA;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b === undefined ? 1 : b, Math.max(a === undefined ? 0 : a, v));
  const lerp = (a, b, f) => a + (b - a) * f;
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const desktop = () => window.innerWidth > 900;

  // ── Content ───────────────────────────────────────────────────────────
  function doiUrl(p) {
    if (p.doi) return p.doi.startsWith('http') ? p.doi : 'https://doi.org/' + p.doi;
    return 'https://scholar.google.com/scholar?q=' + encodeURIComponent(p.title);
  }
  const italicise = t => esc(t).replace(/\b(Staphylococcus aureus|Enterococcus faecalis|Vibrio cholerae|Escherichia coli|Murraya koenigii|Tachypleus gigas|Moringa oleifera|Ideonella sakaiensis|Aurelia aurita|Naja kaouthia|T\. gigas|S\. aureus|E\. coli|in silico|in vitro|Vibrio)\b/g, '<em>$1</em>');

  function renderStatic() {
    const L = V.lab;
    $('#heroDept').textContent = L.department;
    $('#heroUni').textContent = L.university;

    $('#heroStages').innerHTML = V.stages.map(s =>
      `<div class="stage"><div class="stage__key" aria-hidden="true">${esc(s.key)}</div><h2 class="stage__word"><em>${esc(s.word)}</em></h2><p class="stage__line">${esc(s.line)}</p></div>`).join('');
    $('#stageTicks').innerHTML = V.stages.map(() => '<i></i>').join('');

    const keys = /^(ViStA|Vibrio|structural|analysis,?)$/;
    $('#manifesto').innerHTML = V.manifesto.split(' ').map(w => `<span${keys.test(w) ? ' class="k"' : ''}>${esc(w)}</span>`).join(' ');
    $('#aboutText').textContent = V.about;

    const track = $('#marquee .marquee__track');
    track.innerHTML = [0, 1].map(() => V.marquee.map(m => `<span>${esc(m)}</span>`).join('')).join('');

    $('#researchTrack').innerHTML = V.research.map((r, i) => `
      <article class="panel">
        <div class="panel__copy">
          <span class="panel__num mono">${String(i + 1).padStart(2, '0')} / ${String(V.research.length).padStart(2, '0')}</span>
          <h3>${esc(r.title)}</h3>
          <p>${italicise(r.desc)}</p>
          <ul class="tags">${r.tags.map(t => `<li>${italicise(t)}</li>`).join('')}</ul>
        </div>
        <div class="panel__scene"><canvas data-scene="${esc(r.scene)}" role="img" aria-label="Animated illustration for ${esc(r.title)}"></canvas></div>
      </article>`).join('');

    const [film, scope] = V.footage;
    $('#filmCopy').innerHTML = `<span class="mono eyebrow">( ${esc(film.tag)} )</span><h3>${esc(film.title)}</h3><p>${italicise(film.text)}</p>`;
    $('#filmVideo').poster = film.poster; $('#filmVideo').dataset.src = film.video;
    $('#scopeCopy').innerHTML = `<p class="mono eyebrow reveal">( ${esc(scope.tag)} )</p><h3 class="split">${esc(scope.title)}</h3><p class="reveal">${italicise(scope.text)}</p>`;
    $('#scopeVideo').poster = scope.poster; $('#scopeVideo').dataset.src = scope.video;

    const F = V.featured;
    $('#feature').innerHTML = `
      <div class="feature__img" id="featureImg"><img src="${esc(F.image)}" alt="Superimposed structures of candidate PETase enzymes" loading="lazy" width="892" height="522"></div>
      <div>
        <span class="feature__label mono">${esc(F.label)}</span>
        <h3>${italicise(F.title)}</h3>
        <p>${esc(F.text)}</p>
        <div class="feature__meta mono"><span>${esc(F.venue)}</span><span>${esc(F.year)}</span><span>${esc(F.authors)}</span></div>
        <a class="btn btn--ghost" href="${esc(doiUrl(F))}" target="_blank" rel="noopener" data-magnetic>Read the paper <span aria-hidden="true">↗</span></a>
      </div>`;
    $('#pubMore').href = L.scholar;

    const P = V.pi, initials = P.name.replace(/^(Prof\.|Dr\.|\s)+/g, '').split(' ').map(n => n[0]).slice(0, 2).join('');
    $('#pi').innerHTML = `
      <div class="member__img pi__img">${P.image ? `<img src="${esc(P.image)}" alt="${esc(P.name)}" width="720" height="960">` : `<b>${esc(initials)}</b>`}</div>
      <div class="pi__body">${P.role ? `<span class="mono eyebrow">${esc(P.role)}</span>` : ''}<h3>${esc(P.name)}</h3><p>${esc(P.title)}</p>
      <div class="pi__links"><a class="btn" href="${esc(L.scholar)}" target="_blank" rel="noopener" data-magnetic>Scholar <span aria-hidden="true">↗</span></a><a class="btn" href="mailto:${esc(P.email)}" data-magnetic>Email <span aria-hidden="true">→</span></a></div></div>`;
    $('#alumni').innerHTML = V.alumni.map(a => `<li>${a.image ? `<img src="${esc(a.image)}" alt="" loading="lazy" width="60" height="60">` : ''}${esc(a.name)}</li>`).join('');

    const J = V.join, jw = J.title.split(' ');
    $('#joinTitle').innerHTML = `${esc(jw.slice(0, -2).join(' '))} <em>${esc(jw.slice(-2).join(' '))}</em>`;
    $('#joinText').textContent = J.text;
    if (J.image) $('#joinImg').src = J.image; else { joinMedia.remove(); $('#join').classList.add('join--solo'); }
    $('#joinCta').href = `mailto:${L.email}?subject=${encodeURIComponent('Application — ViStA Lab')}`;

    $('#contactText').textContent = V.contact.text;
    $('#cEmail').textContent = L.email; $('#cEmail').href = 'mailto:' + L.email;
    $('#cAddr').textContent = L.address;
    $('#cMap').textContent = L.coords + ' ↗'; $('#cMap').href = L.map;
    $('#footCopy').textContent = `© ${new Date().getFullYear()} ${L.name} · ${L.professor}`;
    $('#footUni').textContent = `${L.department} · ${L.university}`;
  }

  function renderTeam() {
    $('#team').innerHTML = V.team.map((m, i) => `
      <article class="member reveal" style="transition-delay:${(i % 4) * 80}ms">
        <div class="member__img">${m.image ? `<img src="${esc(m.image)}" alt="${esc(m.name || 'Lab member')}" loading="lazy" width="720" height="960">` : ''}<span>${String(i + 1).padStart(2, '0')}</span></div>
        ${m.name ? `<h3>${esc(m.name)}</h3>` : ''}${m.role ? `<p>${esc(m.role)}</p>` : ''}
      </article>`).join('');
  }

  function renderOpenings() {
    const J = V.join, list = V.opportunities || [];
    $('#openings').innerHTML = list.length
      ? list.map(o => `<div class="opening reveal"><span class="mono">${esc(o.type || 'Open')}${o.deadline ? ' · apply by ' + esc(o.deadline) : ''}</span><h3>${esc(o.title)}</h3>${o.description ? `<p>${esc(o.description)}</p>` : ''}</div>`).join('')
      : `<div class="opening reveal"><h3>${esc(J.fallbackTitle)}</h3><p>${esc(J.fallback)}</p></div>`;
  }

  // Publications: the most recent few; the rest live on Google Scholar
  function renderPubs() {
    const pubs = V.publications.slice().sort((a, b) => (b.year || 0) - (a.year || 0)).slice(0, V.recentPublications || 6);
    $('#pubList').innerHTML = pubs.map(p => `
      <li class="pub reveal">
        <a href="${esc(doiUrl(p))}" target="_blank" rel="noopener" data-cursor="Read">
          <span class="pub__year mono">${p.year || '—'}</span>
          <span><span class="pub__title">${italicise(p.title)}</span><span class="pub__authors" style="display:block">${esc(p.authors)}</span></span>
          <span class="pub__venue mono">${esc(p.venue)}</span>
          <span class="pub__arrow" aria-hidden="true">↗</span>
        </a>
      </li>`).join('');
  }

  // Optional Google Sheets override (same CSV contract as the previous site)
  function parseCSV(csv) {
    const rows = []; let row = [], field = '', q = false;
    for (let i = 0; i < csv.length; i++) {
      const c = csv[i];
      if (q) { if (c === '"' && csv[i + 1] === '"') { field += '"'; i++; } else if (c === '"') q = false; else field += c; }
      else if (c === '"') q = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c !== '\r') field += c;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    if (rows.length < 2) return [];
    const head = rows[0].map(h => h.trim());
    return rows.slice(1).filter(r => r.some(c => c.trim())).map(r => Object.fromEntries(head.map((h, i) => [h, (r[i] || '').trim()])));
  }
  function loadSheets() {
    const S = V.sheets || {};
    const get = (url, then) => url && fetch(url).then(r => r.ok ? r.text() : '').then(t => { const rows = parseCSV(t); if (rows.length) { then(rows); afterRender(); } }).catch(() => {});
    get(S.publications, rows => { V.publications = rows.map(r => ({ title: r.title, authors: r.authors, venue: r.venue, year: Number(r.year) || null, doi: r.doi })); renderPubs(); });
    get(S.team, rows => {
      const all = rows.sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99)).map(r => ({ name: r.name, role: r.title || r.role, image: /^(https?:|assets\/)/.test(r.image || '') ? r.image : '', pi: /principal/i.test(r.role || '') }));
      V.team = all.filter(m => !m.pi); renderTeam();
    });
    get(S.opportunities, rows => { V.opportunities = rows; renderOpenings(); });
  }

  // ── Reveal + split text ───────────────────────────────────────────────
  function split(el) {
    if (el.dataset.split) return; el.dataset.split = '1';
    let i = 0; const frag = document.createDocumentFragment();
    Array.from(el.childNodes).forEach(nd => {
      const em = nd.nodeName === 'EM';
      if (nd.nodeType !== 3 && !em) { frag.append(nd.cloneNode(true)); return; }
      nd.textContent.split(/(\s+)/).forEach(tok => {
        if (!tok) return;
        if (/^\s+$/.test(tok)) { frag.append(' '); return; }
        const w = document.createElement('span'), s = document.createElement('span');
        w.className = 'w'; s.style.setProperty('--i', i++);
        if (em) { const e = document.createElement('em'); e.textContent = tok; s.append(e); } else s.textContent = tok;
        w.append(s); frag.append(w);
      });
    });
    el.textContent = ''; el.append(frag);
  }
  const revealIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); revealIO.unobserve(e.target);
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  function afterRender() {
    $$('.split').forEach(split);
    $$('.reveal:not(.in), .split:not(.in)').forEach(el => revealIO.observe(el));
    bindHover(); measure();
  }

  // ── Layout cache ──────────────────────────────────────────────────────
  const hero = $('#top'), research = $('#research'), rTrack = $('#researchTrack'), film = $('#film'),
    manifesto = $('#manifesto'), joinMedia = $('.join__media'), footer = $('.footer'), teamEl = $('#team');
  const M = { vh: 1, vw: 1, doc: 1 };
  let zones = [], members = [];
  const absTop = el => el.getBoundingClientRect().top + window.scrollY;

  function measure() {
    M.vh = window.innerHeight; M.vw = window.innerWidth;
    if (desktop()) {
      M.rDist = Math.max(0, rTrack.scrollWidth - M.vw);
      research.style.height = (M.vh + M.rDist) + 'px';
    } else { research.style.height = ''; rTrack.style.transform = ''; M.rDist = 0; }
    M.hero = [absTop(hero), hero.offsetHeight];
    M.research = [absTop(research), research.offsetHeight];
    M.film = [absTop(film), film.offsetHeight];
    M.manifesto = [absTop(manifesto), manifesto.offsetHeight];
    M.join = [absTop(joinMedia), joinMedia.offsetHeight];
    M.footer = [absTop(footer), footer.offsetHeight];
    M.doc = document.documentElement.scrollHeight - M.vh;
    zones = $$('[data-zone]').map(el => [absTop(el), el.dataset.zone]);
    const tt = absTop(teamEl);
    members = $$('.member', teamEl).map((el, i) => ({ el, top: tt + el.offsetTop, h: el.offsetHeight, speed: [18, -26, 30, -14][i % 4] }));
    M.light = [absTop($('#people')), absTop($('#join')) + $('#join').offsetHeight];
  }
  window.addEventListener('resize', () => { measure(); gl && gl.resize(); });
  if ('ResizeObserver' in window) new ResizeObserver(() => measure()).observe($('#main'));

  // ── Hero GL ───────────────────────────────────────────────────────────
  let gl = null;
  try { gl = window.VistaGL.init($('#gl')); } catch (e) { console.warn('WebGL unavailable', e); }
  const mouse = { x: 0, y: 0, cx: 9, cy: 9, sx: 0, sy: 0, gx: 9, gy: 9 };
  window.addEventListener('pointermove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    mouse.cx = (e.clientX / M.vw) * 2 - 1; mouse.cy = -((e.clientY / M.vh) * 2 - 1);
  }, { passive: true });

  const heroTitle = $('#heroTitle'), stageNow = $('#stageNow');
  let stageEls = [], tickEls = [], lastStage = -2;

  function updateHero(sy, time) {
    const p = clamp((sy - M.hero[0]) / (M.hero[1] - M.vh));
    const T = smooth(0.18, 0.32, p) + smooth(0.43, 0.57, p) + smooth(0.68, 0.82, p);
    const o = 1 - clamp((p - 0.03) / 0.07);
    heroTitle.style.opacity = o; heroTitle.style.transform = `translate3d(0,${-(1 - o) * 70}px,0)`;
    heroTitle.style.visibility = o <= 0 ? 'hidden' : '';
    const idx = p < 0.09 ? -1 : p < 0.25 ? 0 : p < 0.5 ? 1 : p < 0.75 ? 2 : 3;
    if (idx !== lastStage) {
      lastStage = idx;
      stageEls.forEach((el, i) => { el.classList.toggle('on', i === idx); el.classList.toggle('past', i < idx); });
      stageNow.textContent = String(Math.max(0, idx) + 1).padStart(2, '0');
    }
    tickEls.forEach((el, i) => el.style.setProperty('--f', clamp((p - i / 4) * 4).toFixed(3)));
    if (!gl) return;
    mouse.sx = lerp(mouse.sx, mouse.cx > 2 ? 0 : mouse.cx, 0.05); mouse.sy = lerp(mouse.sy, mouse.cy > 2 ? 0 : mouse.cy, 0.05);
    mouse.gx = lerp(mouse.gx, mouse.cx, 0.12); mouse.gy = lerp(mouse.gy, mouse.cy, 0.12);
    const s = gl.state, t = RM ? 0 : time;
    s.t = T;
    s.rot[0] = Math.sin(t * 0.22) * (0.5 - 0.3 * smooth(2, 3, T)) + mouse.sx * 0.45;
    s.rot[1] = Math.sin(t * 0.17) * 0.12 - mouse.sy * 0.25;
    s.mouse[0] = mouse.gx; s.mouse[1] = mouse.gy;
    s.fade = 1 - smooth(0.93, 1, p) * 0.6;
    gl.render(t);
  }

  // ── Scenes ────────────────────────────────────────────────────────────
  const scenes = [];
  const sceneIO = new IntersectionObserver(es => es.forEach(e => { const s = scenes.find(x => x.canvas === e.target); if (s) s.on = e.isIntersecting; }), { rootMargin: '10%' });
  function initScenes() {
    $$('canvas[data-scene]').forEach(c => {
      const make = window.VistaScenes[c.dataset.scene]; if (!make) return;
      scenes.push({ canvas: c, draw: make(c), on: false, drawn: false }); sceneIO.observe(c);
    });
    const g = $('#globe'); scenes.push({ canvas: g, draw: window.VistaScenes.globe(g), on: false, drawn: false }); sceneIO.observe(g);
  }

  // ── Snow ──────────────────────────────────────────────────────────────
  const snow = $('#snow'), sctx = snow.getContext('2d'); let flakes = [];
  function fitSnow() {
    const d = Math.min(window.devicePixelRatio || 1, 1.5);
    snow.width = window.innerWidth * d; snow.height = window.innerHeight * d; sctx.setTransform(d, 0, 0, d, 0, 0);
    flakes = Array.from({ length: window.innerWidth < 700 ? 40 : 90 }, () => ({ x: Math.random(), y: Math.random(), z: 0.2 + Math.random() * 0.8, p: Math.random() * 6.28 }));
  }
  fitSnow(); window.addEventListener('resize', fitSnow);
  function drawSnow(sy, time) {
    const w = window.innerWidth, h = window.innerHeight;
    sctx.clearRect(0, 0, w, h);
    for (const f of flakes) {
      const y = (((f.y * h + time * 9 * f.z - sy * 0.35 * f.z) % h) + h) % h, x = f.x * w + Math.sin(time * 0.4 + f.p) * 14 * f.z;
      sctx.fillStyle = `rgba(200,236,240,${0.08 + f.z * 0.3})`;
      sctx.beginPath(); sctx.arc(x, y, 0.6 + f.z * 1.6, 0, 6.283); sctx.fill();
    }
  }

  // ── Main loop ─────────────────────────────────────────────────────────
  const nav = $('#nav'), gaugeFill = $('#gaugeFill'), gaugeNum = $('#gaugeNum'), gaugeZone = $('#gaugeZone'),
    researchBar = $('#researchBar'), filmFrame = $('#filmFrame'), filmStick = $('.film__stick'), filmVideo = $('#filmVideo'),
    filmClock = $('#filmClock'), marqueeTrack = $('#marquee .marquee__track'), mWords = () => $$('#manifesto span'), cursor = $('#cursor');
  let words = [], prevNow = 0, sm = window.scrollY, lastY = window.scrollY, vel = 0, mx = 0, navY = window.scrollY, zoneNow = '', curX = 0, curY = 0, lit = -1;

  function frame(now) {
    const time = now / 1000, sy = window.scrollY;
    const dt = Math.min(0.1, (now - prevNow) / 1000 || 0.016); prevNow = now;
    sm = RM ? sy : lerp(sm, sy, 1 - Math.exp(-dt * 9)); if (Math.abs(sm - sy) < 0.05) sm = sy;
    vel = lerp(vel, sy - lastY, 0.2); lastY = sy;

    // nav hide/show
    if (Math.abs(sy - navY) > 8) { nav.classList.toggle('hide', sy > navY && sy > 200 && !document.body.classList.contains('menu-open')); navY = sy; }

    // depth gauge + sunlight
    const frac = clamp(sy / (M.doc || 1));
    gaugeFill.style.transform = `scaleY(${frac})`;
    gaugeNum.textContent = String(Math.round(frac * 4000)).padStart(4, '0');
    document.body.style.setProperty('--sun', (1 - clamp(frac * 2.4)).toFixed(3));
    let z = zones.length ? zones[0][1] : '';
    for (const zn of zones) if (sy + M.vh * 0.5 >= zn[0]) z = zn[1];
    if (z !== zoneNow) { zoneNow = z; gaugeZone.textContent = z; }
    const mid = sy + 40;
    document.body.classList.toggle('on-light', mid > M.light[0] && mid < M.light[1]);

    // hero
    if (sy < M.hero[0] + M.hero[1]) updateHero(sm, time);

    // manifesto word-by-word
    const mp = clamp((sm + M.vh * 0.78 - M.manifesto[0]) / (M.manifesto[1] + M.vh * 0.3));
    const upto = Math.floor(mp * (words.length + 1));
    if (upto !== lit) { lit = upto; words.forEach((w, i) => w.classList.toggle('lit', i < upto)); }

    // marquee
    if (!RM) {
      mx -= (0.7 + Math.min(40, Math.abs(vel)) * 0.5) * dt * 60;
      const half = marqueeTrack.scrollWidth / 2; if (half && -mx > half) mx += half;
      marqueeTrack.style.transform = `translate3d(${mx}px,0,0) skewX(${clamp(vel * -0.25, -12, 12)}deg)`;
    }

    // research horizontal pin
    if (M.rDist) {
      const rp = clamp((sm - M.research[0]) / (M.research[1] - M.vh));
      rTrack.style.transform = `translate3d(${-rp * M.rDist}px,0,0)`;
      researchBar.style.transform = `scaleX(${rp})`;
    }

    // film expand
    const fp = clamp((sm - M.film[0]) / (M.film[1] - M.vh));
    if (sm > M.film[0] - M.vh && sm < M.film[0] + M.film[1]) {
      const g = smooth(0, 0.55, fp), wide = desktop();
      filmFrame.style.setProperty('--ix', lerp(wide ? 30 : 12, 0, g) + '%');
      filmFrame.style.setProperty('--iy', lerp(wide ? 31 : 34, 0, g) + '%');
      filmFrame.style.setProperty('--r', lerp(28, 0, g) + 'px');
      filmFrame.style.setProperty('--z', lerp(1.25, 1, g));
      filmFrame.style.setProperty('--shade', smooth(0.5, 0.7, fp));
      filmFrame.style.setProperty('--copy', smooth(0.6, 0.8, fp));
      filmStick.style.setProperty('--intro', 1 - smooth(0.02, 0.22, fp));
      const ct = filmVideo.currentTime || 0;
      filmClock.textContent = `00:${String(Math.floor(ct / 60)).padStart(2, '0')}:${String(Math.floor(ct % 60)).padStart(2, '0')}`;
    }

    // team parallax
    if (desktop() && !RM) for (const m of members) {
      if (m.top > sm + M.vh * 1.3 || m.top + m.h < sm - M.vh * 0.3) continue;
      m.el.style.transform = `translate3d(0,${((m.top + m.h / 2 - sm - M.vh / 2) / M.vh) * m.speed}px,0)`;
    }
    joinMedia.style.setProperty('--py', lerp(-16, 0, clamp((sm + M.vh - M.join[0]) / (M.vh + M.join[1]))) + '%');
    footer.style.setProperty('--fy', lerp(30, 0, clamp((sm + M.vh - M.footer[0]) / M.footer[1])));

    // canvases
    for (const s of scenes) if (s.on && (!RM || !s.drawn)) { s.draw(RM ? 3.5 : time); s.drawn = true; }
    if (frac < 0.8 && !RM) drawSnow(sm, time);

    // cursor
    if (FINE) { curX = lerp(curX, mouse.x, 0.22); curY = lerp(curY, mouse.y, 0.22); cursor.style.transform = `translate3d(${curX}px,${curY}px,0)`; }

    requestAnimationFrame(frame);
  }

  // ── Interactions ──────────────────────────────────────────────────────
  function bindHover() {
    if (!FINE) return;
    $$('a, button, [data-cursor]').forEach(el => {
      if (el.dataset.hv) return; el.dataset.hv = '1';
      const lab = el.closest('[data-cursor]');
      el.addEventListener('pointerenter', () => { cursor.classList.add(lab ? 'label' : 'link'); if (lab) cursor.firstElementChild.textContent = lab.dataset.cursor; });
      el.addEventListener('pointerleave', () => cursor.classList.remove('label', 'link'));
    });
    if (RM) return;
    $$('[data-magnetic]').forEach(el => {
      if (el.dataset.mg) return; el.dataset.mg = '1';
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px,${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1), background .35s, color .35s, border-color .35s'; el.style.transform = ''; setTimeout(() => el.style.transition = '', 600); });
    });
    const fi = $('#featureImg');
    if (fi && !fi.dataset.tilt) {
      fi.dataset.tilt = '1';
      fi.addEventListener('pointermove', e => {
        const r = fi.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        fi.style.setProperty('--ry', (x - 0.5) * 14 + 'deg'); fi.style.setProperty('--rx', (0.5 - y) * 12 + 'deg');
        fi.style.setProperty('--mx', x * 100 + '%'); fi.style.setProperty('--my', y * 100 + '%');
      });
      fi.addEventListener('pointerleave', () => { fi.style.setProperty('--ry', '0deg'); fi.style.setProperty('--rx', '0deg'); });
    }
  }
  if (FINE) {
    window.addEventListener('pointermove', () => cursor.classList.add('on'), { once: true });
    document.addEventListener('pointerleave', () => cursor.classList.remove('on'));
    document.addEventListener('pointerenter', () => cursor.classList.add('on'));
  }

  // menu
  const burger = $('#burger'), menu = $('#menu');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open)); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
  }
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // nav active link
  const navLinks = $$('.nav__links a');
  const navIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section[id]').forEach(s => navIO.observe(s));

  // videos: load when near, play only while visible
  const vidIO = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { if (!v.src && v.dataset.src) v.src = v.dataset.src; if (!RM) v.play().catch(() => {}); }
    else if (!v.paused) v.pause();
  }), { rootMargin: '60% 0px' });
  $$('video').forEach(v => vidIO.observe(v));
  $('#scopeLens').addEventListener('click', () => { const v = $('#scopeVideo'); v.paused ? v.play().catch(() => {}) : v.pause(); });

  // contact form → mail client
  const form = $('#form'), note = $('#formNote');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let bad = null;
    $$('.field', form).forEach(f => { const i = f.firstElementChild, miss = !i.value.trim(); f.classList.toggle('bad', miss); i.setAttribute('aria-invalid', String(miss)); if (miss && !bad) bad = i; });
    if (bad) { note.textContent = 'Please fill in the highlighted fields.'; note.classList.add('bad'); bad.focus(); return; }
    note.classList.remove('bad'); note.textContent = 'Opening your mail app…';
    const d = new FormData(form);
    window.location.href = `mailto:${V.lab.email}?subject=${encodeURIComponent(d.get('subject'))}&body=${encodeURIComponent(d.get('message') + '\n\n— ' + d.get('name'))}`;
  });
  form.addEventListener('input', e => { const f = e.target.closest('.field'); if (f && e.target.value.trim()) f.classList.remove('bad'); });

  // Goa clock
  const clock = $('#cTime'), fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const tick = () => { clock.textContent = fmt.format(new Date()) + ' IST'; };
  tick(); setInterval(tick, 1000);

  // ── Boot ──────────────────────────────────────────────────────────────
  renderStatic(); renderTeam(); renderOpenings(); renderPubs();
  stageEls = $$('.stage'); tickEls = $$('#stageTicks i'); words = mWords();
  initScenes(); afterRender(); loadSheets();
  requestAnimationFrame(frame);

  const loader = $('#loader'), bar = $('#loaderBar'), num = $('#loaderNum');
  function ready() {
    loader.classList.add('done'); document.body.classList.remove('is-loading'); document.body.classList.add('ready');
    measure();
  }
  if (RM) ready();
  else {
    const t0 = performance.now(), dur = 1500; let fontsIn = false;
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => fontsIn = true);
    (function step(now) {
      const f = clamp((now - t0) / dur), e = 1 - Math.pow(1 - f, 3);
      bar.style.transform = `scaleX(${e})`; num.textContent = String(Math.round(e * 100)).padStart(3, '0');
      if (f < 1 || (!fontsIn && now - t0 < 3500)) requestAnimationFrame(step); else setTimeout(ready, 150);
    })(t0);
  }
})();
