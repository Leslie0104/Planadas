/* =========================================================
   PLANADAS · TOLIMA · COLOMBIA — interacción
   ========================================================= */
(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const easeIO = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const Sound = window.Soundscape;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const I18 = window.I18N;
  const T = (k) => (I18 ? I18.t(k) : k);
  const LOCALE = () => (I18 && I18.lang === 'en' ? 'en-US' : 'es-CO');

  /* =======================================================
     1. ESPACIOS PARA FOTOS
     Cada <figure class="ph" data-src="..."> intenta cargar
     su foto; si no existe, muestra un marco con el nombre
     del archivo que debes poner en img/fotos/.
     ======================================================= */
  const imgCache = {};
  function loadImg(src) {
    if (!src) return Promise.resolve(false);
    if (!imgCache[src]) {
      imgCache[src] = new Promise((res) => {
        const i = new Image();
        i.onload = () => res(true);
        i.onerror = () => res(false);
        i.src = src;
      });
    }
    return imgCache[src];
  }
  function fillPh(fig, src, label) {
    if (src !== undefined) fig.dataset.src = src;
    if (label !== undefined) fig.dataset.label = label;
    src = fig.dataset.src || '';
    label = fig.dataset.label || 'Foto';
    let lab = fig.querySelector('.ph__label');
    if (!lab) {
      lab = document.createElement('figcaption');
      lab.className = 'ph__label';
      fig.appendChild(lab);
    }
    lab.innerHTML = '<em>' + label + '</em><small>' + (src || 'img/fotos/…') + '</small>';
    const img = fig.querySelector('.ph__img');
    fig.classList.remove('is-loaded');
    if (img) img.style.backgroundImage = '';
    loadImg(src).then((ok) => {
      if (fig.dataset.src !== src || !ok || !img) return;
      img.style.backgroundImage = 'url("' + src + '")';
      fig.classList.add('is-loaded');
    });
  }

  // en móvil, cultura muestra la foto dentro de cada artículo
  $$('.culture__item').forEach((item, i) => {
    const src = $$('.culture__ph')[i];
    if (!src) return;
    const clone = src.cloneNode(true);
    clone.classList.remove('culture__ph', 'is-active', 'was-active');
    item.appendChild(clone);
  });
  $$('.ph').forEach((f) => fillPh(f));

  /* =======================================================
     2. DIVISIÓN DE TEXTO
     ======================================================= */
  $$('[data-split]').forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split('').map((ch) =>
      '<span class="char-wrap" aria-hidden="true"><span class="char">' + (ch === ' ' ? '&nbsp;' : ch) + '</span></span>'
    ).join('');
  });

  const EM_WORDS = ['grano', 'café', 'montaña', 'neblina', 'recordar.', 'bean.', 'coffee', 'mountain', 'mist', 'remember.'];
  $$('[data-words]').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => {
      const em = EM_WORDS.includes(w.toLowerCase().replace(/[,:]/g, '')) || EM_WORDS.includes(w.toLowerCase());
      return '<span class="w' + (em ? ' is-em' : '') + '">' + w + '</span>';
    }).join(' ');
  });

  /* =======================================================
     3. FECHA DE LA CARTA
     ======================================================= */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  const dateEl = $('#letterDate');
  const renderDate = () => { if (dateEl) dateEl.textContent = new Date().toLocaleDateString(LOCALE(), { day: 'numeric', month: 'long', year: 'numeric' }); };
  renderDate();
  initLang();
  initWeather();
  initPack();

  /* Sin GSAP (sin conexión): mostrar todo de forma estática */
  if (!hasGsap) {
    $('#loader').remove();
    document.body.classList.remove('is-loading');
    $$('.manifesto__text .w').forEach((w) => (w.style.opacity = 1));
    initSoundUI();
    initForm();
    initGlobe();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* =======================================================
     4. SCROLL SUAVE
     ======================================================= */
  let lenis = null;
  let scrollVel = 0;
  if (window.Lenis && !reduced) {
    lenis = new Lenis({ lerp: .085, smoothWheel: true, wheelMultiplier: .95 });
    lenis.on('scroll', (e) => { scrollVel = e.velocity || 0; ScrollTrigger.update(); });
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  function scrollToTarget(target) {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }

  /* =======================================================
     5. PRELOADER
     ======================================================= */
  const loader = $('#loader');
  const altEl = $('#loaderAlt');
  const heroChars = $$('.hero__word .char');
  gsap.set(heroChars, { yPercent: 110 });
  gsap.set('.hero__sub, .hero__eyebrow, .hero__seal, .hero__cue', { opacity: 0, y: 20 });
  gsap.set('.hero__arch', { clipPath: 'inset(100% 0 0 0)' });

  const counter = { v: 0 };
  const intro = gsap.timeline();
  intro
    .from('.loader__title .char', { yPercent: 110, duration: 1.2, stagger: .06, ease: 'expo.out' }, .2)
    .from('.loader__logo', { opacity: 0, scale: .85, rotation: -20, duration: 1.4, ease: 'expo.out' }, 0)
    .from('.loader__eyebrow, .loader__flag', { opacity: 0, y: 10, duration: .8 }, .4)
    .to(counter, {
      v: 1450, duration: 2.4, ease: 'power2.inOut',
      onUpdate: () => { altEl.textContent = Math.round(counter.v).toLocaleString(LOCALE()); }
    }, .3)
    .to('#loaderBar', { scaleX: 1, duration: 2.4, ease: 'power2.inOut' }, .3);

  Promise.all([
    new Promise((r) => intro.eventCallback('onComplete', r)),
    Promise.race([
      document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((r) => setTimeout(r, 1500))
    ])
  ]).then(() => {
    gsap.to('.loader__meter, .loader__line', { opacity: 0, y: -10, duration: .6 });
    gsap.to('.loader__choice', { autoAlpha: 1, y: 0, duration: .9, delay: .3, ease: 'expo.out' });
    gsap.to('.loader__hint', { opacity: 1, duration: 1, delay: .6 });
  });

  $$('[data-enter]').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.enter === 'sound' && Sound) Sound.enable();
    enterSite();
  }, { once: true }));

  function enterSite() {
    const tl = gsap.timeline();
    tl.to('.loader__choice, .loader__hint, .loader__eyebrow, .loader__flag, .loader__logo', { opacity: 0, duration: .4 })
      .to('.loader__title .char', { yPercent: -110, duration: .8, stagger: .03, ease: 'expo.in' }, 0)
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.3, ease: 'expo.inOut' }, .5)
      .add(() => {
        loader.remove();
        document.body.classList.remove('is-loading');
        if (lenis) lenis.start();
        ScrollTrigger.refresh();
      })
      .to(heroChars, { yPercent: 0, duration: 1.5, stagger: .05, ease: 'expo.out' }, 1.1)
      .to('.hero__arch', { clipPath: 'inset(0% 0 0 0)', duration: 1.8, ease: 'expo.inOut' }, 1)
      .to('.hero__eyebrow, .hero__sub', { opacity: 1, y: 0, duration: 1.2, stagger: .1, ease: 'expo.out' }, 1.6)
      .to('.hero__seal, .hero__cue', { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, 1.9)
      .from('.topbar > *', { opacity: 0, y: -20, duration: 1, stagger: .1, clearProps: 'opacity,transform' }, 1.7)
      .from('.sound, .rail', { opacity: 0, duration: 1, clearProps: 'opacity' }, 2);
  }

  /* =======================================================
     6. CURSOR
     ======================================================= */
  if (finePointer && !reduced) {
    document.documentElement.classList.add('has-cursor');
    const cur = $('#cursor');
    const dot = $('.cursor__dot', cur);
    const ring = $('.cursor__ring', cur);
    const txt = $('.cursor__txt', cur);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    gsap.ticker.add(() => {
      rx = lerp(rx, mx, .16); ry = lerp(ry, my, .16);
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
    });
    document.addEventListener('mouseover', (e) => {
      const t = e.target;
      const labeled = t.closest('[data-cursor]');
      cur.classList.toggle('is-text', !!labeled);
      txt.textContent = labeled ? labeled.dataset.cursor : '';
      cur.classList.toggle('is-link', !labeled && !!t.closest('a, button, label, .dish, .ticket'));
      cur.classList.toggle('is-dark', !!t.closest('.globe, .food, .map, .footer, .index, .loader, .cinema'));
    });
    document.addEventListener('mouseleave', () => gsap.to(cur, { opacity: 0, duration: .3 }));
    document.addEventListener('mouseenter', () => gsap.to(cur, { opacity: 1, duration: .3 }));
  }

  /* =======================================================
     7. MENÚ ÍNDICE
     ======================================================= */
  const menu = $('#indexMenu');
  const menuBtn = $('#menuBtn');
  const menuLabel = $('.menu-btn__label');
  const preview = $('#indexPreview');
  let menuOpen = false;
  const menuOrigin = () => {
    const r = $('.menu-btn__lines').getBoundingClientRect();
    return Math.round(r.left + r.width / 2) + 'px ' + Math.round(r.top + r.height / 2) + 'px';
  };
  // la animación se construye en cada apertura/cierre con valores explícitos
  let menuTl = null;
  const menuLinks = $$('.index__list a');
  const menuExtras = $$('.index__eyebrow, .index__aside');

  function toggleMenu(force) {
    menuOpen = typeof force === 'boolean' ? force : !menuOpen;
    document.body.classList.toggle('menu-open', menuOpen);
    menuBtn.setAttribute('aria-expanded', menuOpen);
    menu.setAttribute('aria-hidden', !menuOpen);
    menuLabel.textContent = menuOpen ? menuLabel.dataset.close : menuLabel.dataset.open;
    if (menuTl) menuTl.kill();
    const origin = menuOrigin();
    if (menuOpen) {
      $('#topbar').classList.remove('is-hidden');
      if (lenis) lenis.stop();
      menuTl = gsap.timeline()
        .set(menu, { visibility: 'visible' })
        .set(menuLinks, { yPercent: 110 })
        .set(menuExtras, { opacity: 0, y: 20 })
        .fromTo('.index__bg', { clipPath: 'circle(0% at ' + origin + ')' },
          { clipPath: 'circle(150% at ' + origin + ')', duration: 1, ease: 'expo.inOut' })
        .to(menuLinks, { yPercent: 0, duration: 1, stagger: .05, ease: 'expo.out' }, .4)
        .to(menuExtras, { opacity: 1, y: 0, duration: .8, stagger: .08, ease: 'expo.out' }, .55);
    } else {
      if (lenis) lenis.start();
      menuTl = gsap.timeline()
        .to(menuLinks, { yPercent: -110, duration: .45, stagger: .02, ease: 'expo.in' })
        .to(menuExtras, { opacity: 0, duration: .3 }, 0)
        .to('.index__bg', { clipPath: 'circle(0% at ' + origin + ')', duration: .75, ease: 'expo.inOut' }, .2)
        .set(menu, { visibility: 'hidden' });
    }
  }
  menuBtn.addEventListener('click', () => toggleMenu());
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) toggleMenu(false); });

  const NOTES = [293.66, 329.63, 349.23, 392, 440, 493.88, 523.25, 587.33];
  menuLinks.forEach((a, i) => {
    a.addEventListener('mouseenter', () => {
      fillPh(preview, a.dataset.preview, a.dataset.label);
      gsap.fromTo(preview, { clipPath: 'inset(8% 8% 8% 8%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .8, ease: 'expo.out' });
      if (Sound) Sound.tick(NOTES[i % NOTES.length]);
    });
  });

  $$('[data-link]').forEach((a) => a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href.charAt(0) !== '#') return;
    e.preventDefault();
    if (menuOpen) {
      toggleMenu(false);
      setTimeout(() => scrollToTarget(href), 650);
    } else scrollToTarget(href);
  }));

  /* =======================================================
     8. HERO — parallax por capas + movimiento del mouse
     ======================================================= */
  const hero = $('.hero');
  $$('[data-depth]', hero).forEach((el) => {
    const d = parseFloat(el.dataset.depth);
    gsap.to(el, {
      y: () => d * innerHeight, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true }
    });
  });
  gsap.to('.hero__sky', { opacity: .4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  if (finePointer && !reduced) {
    const layers = $$('[data-mouse]', hero).map((el) => ({ fn: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3' }), m: +el.dataset.mouse }));
    const arch = gsap.quickTo('.hero__arch', 'x', { duration: 1.6, ease: 'power3' });
    hero.addEventListener('mousemove', (e) => {
      const nx = e.clientX / innerWidth - .5;
      layers.forEach((l) => l.fn(-nx * l.m * 2));
      arch(nx * 18);
    });
  }

  /* =======================================================
     9. GLOBO — del mundo a Planadas
     ======================================================= */
  initGlobe();

  function globeCaptions() {
    return $$('.gcap').map((el) => ({ el, from: +el.dataset.from, to: +el.dataset.to }));
  }
  function paintCaptions(caps, p) {
    caps.forEach((cp) => {
      const inA = cp.from <= 0 ? 1 : smooth(cp.from, cp.from + .035, p);
      const outA = cp.to >= 1 ? 0 : smooth(cp.to - .035, cp.to, p);
      cp.el.style.opacity = inA * (1 - outA);
      cp.el.style.transform = 'translateY(' + ((1 - inA) * 24 - outA * 24) + 'px)';
    });
  }
  function webglOK() {
    try {
      const cv = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (cv.getContext('webgl2') || cv.getContext('webgl')));
    } catch (e) { return false; }
  }

  /* Globo 3D realista: imágenes satelitales (Esri World Imagery)
     sobre globe.gl. Si no hay WebGL, usa el globo dibujado. */
  function initGlobe() {
    const section = $('#mundo');
    const holder = $('#globeViz');
    if (!section || !holder) return;
    if (!hasGsap || !window.Globe || !webglOK()) return initFlatGlobe();

    const stage = $('.globe__stage');
    const caps = globeCaptions();
    const hudLat = $('#hudLat'), hudLon = $('#hudLon'), hudAlt = $('#hudAlt');
    const PLAN = [-75.644, 3.197];
    const START = [8, 14];
    const interp = window.d3 ? d3.geoInterpolate(START, PLAN)
      : (t) => [lerp(START[0], PLAN[0], t), lerp(START[1], PLAN[1], t)];

    // marcadores HTML sobre el globo
    const mk = (cls, html) => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; return d; };
    const MARKS = [
      { lat: 3.197, lng: -75.644, el: mk('gpin gpin--main', '<i></i><i></i><i></i><b></b><em></em><span>Planadas</span>'), show: [.52, .6] },
      { lat: 3.145, lng: -75.811, el: mk('gpin', '<b></b><span>Gaitania</span>'), show: [.74, .82] },
      { lat: 2.927, lng: -75.282, el: mk('gpin', '<b></b><span>Neiva</span>'), show: [.7, .78] },
      { lat: 4.438, lng: -75.232, el: mk('gpin', '<b></b><span>Ibagué</span>'), show: [.64, .72], hide: [.8, .86] },
      { lat: 4.711, lng: -74.072, el: mk('gpin', '<b></b><span>Bogotá</span>'), show: [.5, .58], hide: [.72, .78] },
      { lat: 2.93, lng: -76.03, el: mk('gpin gpin--peak', '<b></b><span>Nevado del Huila</span>'), show: [.72, .8] },
      { lat: 3.95, lng: -75.1, el: mk('glabel', 'Tolima'), show: [.62, .7], hide: [.86, .92] }
    ];

    const tiles = (x, y, l) => 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/' + l + '/' + y + '/' + x;
    const world = Globe({ animateIn: false, rendererConfig: { antialias: true, alpha: true, powerPreference: 'high-performance' } })(holder)
      .width(stage.clientWidth)
      .height(stage.clientHeight)
      .backgroundColor('rgba(0,0,0,0)')
      .globeImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png')
      .showAtmosphere(true)
      .atmosphereColor('#9cc3ff')
      .atmosphereAltitude(.17)
      .enablePointerInteraction(false)
      .htmlElementsData(MARKS)
      .htmlLat('lat').htmlLng('lng').htmlAltitude(0)
      .htmlElement((d) => d.el)
      .htmlTransitionDuration(0);
    if (world.globeTileEngineUrl) world.globeTileEngineUrl(tiles);

    const ctrl = world.controls();
    ctrl.enabled = false;
    ctrl.enableZoom = false;
    ctrl.autoRotate = false;
    ctrl.minDistance = 100.2;

    // contorno de Colombia
    let colombia = null, lastBucket = -1;
    if (window.topojson) {
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
        .then((r) => r.json())
        .then((w) => {
          colombia = topojson.feature(w, w.objects.countries).features.find((f) => String(f.id) === '170');
          if (!colombia) return;
          world.polygonsData([colombia])
            .polygonAltitude(.0015)
            .polygonSideColor(() => 'rgba(0,0,0,0)')
            .polygonsTransitionDuration(0);
          lastBucket = -1;
          update(prog);
        })
        .catch(() => {});
    }

    let target = 0, prog = 0, visible = false, running = false;
    const startAlt = () => (stage.clientWidth < 700 ? 3.3 : 2.3);
    const END_ALT = .022;

    function update(p) {
      const center = interp(easeIO(clamp(p / .56)));
      const zp = easeIO(clamp((p - .1) / .85));
      const alt = startAlt() * Math.pow(END_ALT / startAlt(), zp);
      world.pointOfView({ lat: center[1], lng: center[0], altitude: alt }, 0);

      if (colombia) {
        const a = smooth(.3, .44, p) * (1 - smooth(.68, .8, p));
        const s = smooth(.3, .44, p) * (1 - smooth(.86, .95, p));
        const bucket = Math.round(a * 20) * 100 + Math.round(s * 20);
        if (bucket !== lastBucket) {
          lastBucket = bucket;
          world.polygonCapColor(() => 'rgba(214,120,80,' + (a * .2).toFixed(3) + ')')
            .polygonStrokeColor(() => 'rgba(230,211,166,' + (s * .95).toFixed(3) + ')');
        }
      }

      MARKS.forEach((m) => {
        let o = smooth(m.show[0], m.show[1], p);
        if (m.hide) o *= 1 - smooth(m.hide[0], m.hide[1], p);
        m.el.style.opacity = o;
        m.el.style.visibility = o > .01 ? 'visible' : 'hidden';
      });

      hudLat.textContent = Math.abs(center[1]).toFixed(2).replace('.', ',') + '° ' + (center[1] >= 0 ? 'N' : 'S');
      hudLon.textContent = Math.abs(center[0]).toFixed(2).replace('.', ',') + '° ' + (center[0] >= 0 ? 'E' : T('dir.W'));
      hudAlt.textContent = Math.round(alt * 6371).toLocaleString(LOCALE()) + ' km';
      paintCaptions(caps, p);
    }

    function loop() {
      prog = reduced ? target : lerp(prog, target, .09);
      update(prog);
      if (visible) requestAnimationFrame(loop);
      else running = false;
    }

    ScrollTrigger.create({
      trigger: section, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => { target = self.progress; }
    });
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) {
        world.resumeAnimation();
        if (!running) { running = true; requestAnimationFrame(loop); }
      } else world.pauseAnimation();
    }).observe(section);

    addEventListener('resize', () => {
      world.width(stage.clientWidth).height(stage.clientHeight);
      update(prog);
    });
    update(0);
  }

  /* Globo dibujado en canvas (respaldo sin WebGL) */
  function initFlatGlobe() {
    const section = $('#mundo');
    const stage = $('.globe__stage');
    if (!section || !stage) return;
    let canvas = $('#globeCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'globeCanvas';
      stage.insertBefore(canvas, stage.firstChild);
    }
    if (!window.d3 || !hasGsap) {
      const fb = document.createElement('div');
      fb.className = 'globe__fallback';
      fb.textContent = 'Planadas · Tolima · Colombia — 3°11′ N, 75°39′ O';
      stage.appendChild(fb);
      $$('.gcap').forEach((g) => (g.style.opacity = 0));
      const last = $('.gcap--final'); if (last) { last.style.opacity = 1; last.style.transform = 'none'; }
      return;
    }

    const c = canvas.getContext('2d');
    const caps = $$('.gcap').map((el) => ({ el, from: +el.dataset.from, to: +el.dataset.to }));
    const hudLat = $('#hudLat'), hudLon = $('#hudLon'), hudAlt = $('#hudAlt');
    const PLAN = [-75.644, 3.197];
    const START = [8, 16];
    const interp = d3.geoInterpolate(START, PLAN);
    const projection = d3.geoOrthographic().clipAngle(90).precision(.35);
    const path = d3.geoPath(projection, c);
    const graticule = d3.geoGraticule10();
    const PLACES = [
      { n: 'Gaitania', c: [-75.81, 3.147] },
      { n: 'Neiva', c: [-75.28, 2.93] },
      { n: 'Ibagué', c: [-75.23, 4.44] },
      { n: 'Bogotá', c: [-74.07, 4.71] },
      { n: 'Nevado del Huila', c: [-76.03, 2.93], peak: true }
    ];
    // curvas de nivel decorativas (no son topografía real)
    const CONTOURS = [];
    function contourSet(lon, lat, rings, step, seed, stretch) {
      for (let r = 1; r <= rings; r++) {
        const pts = [];
        for (let i = 0; i <= 96; i++) {
          const th = (i / 96) * Math.PI * 2;
          const wob = 1 + .16 * Math.sin(3 * th + seed + r * .35) + .07 * Math.sin(7 * th + seed * 2 - r * .2) + .04 * Math.sin(13 * th + r);
          const rad = r * step * wob;
          pts.push([lon + Math.cos(th) * rad * stretch, lat + Math.sin(th) * rad]);
        }
        CONTOURS.push({ geo: { type: 'LineString', coordinates: pts }, strong: r % 5 === 0 });
      }
    }
    contourSet(-76.03, 2.93, 26, .032, 1.3, .8);   // Nevado del Huila
    contourSet(-75.52, 3.45, 16, .028, 4.1, .55);  // filo de la cordillera
    contourSet(-75.75, 2.72, 12, .026, 2.2, 1.1);
    let land = null, borders = null, colombia = null;
    let W = 0, H = 0, DPR = 1, base = 300;
    let target = 0, prog = 0, running = false, visible = false;

    function size() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = stage.clientWidth; H = stage.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      c.setTransform(DPR, 0, 0, DPR, 0, 0);
      base = Math.min(W, H) * (W < 700 ? .44 : .4);
      projection.translate([W / 2, H / 2]).clipExtent([[-20, -20], [W + 20, H + 20]]);
    }
    size();
    addEventListener('resize', () => { size(); draw(prog, performance.now()); });

    const topo = window.topojson;
    if (topo) {
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
        .then((r) => r.json())
        .then((world) => {
          land = topo.feature(world, world.objects.land);
          borders = topo.mesh(world, world.objects.countries, (a, b) => a !== b);
          colombia = topo.feature(world, world.objects.countries).features.find((f) => String(f.id) === '170');
          draw(prog, performance.now());
        })
        .catch(() => {});
    }

    function fmt(v, pos, neg) { return Math.abs(v).toFixed(2).replace('.', ',') + '° ' + (v >= 0 ? pos : neg); }

    function draw(p, t) {
      const pr = easeIO(clamp(p / .56));
      const center = interp(pr);
      const zp = clamp((p - .1) / .85);
      const kFinal = Math.max(W, H) * 24;
      const k = base * Math.pow(kFinal / base, easeIO(zp));
      projection.rotate([-center[0], -center[1]]).scale(k);

      c.clearRect(0, 0, W, H);

      // halo atmosférico
      if (k < Math.max(W, H) * 1.4) {
        const g = c.createRadialGradient(W / 2, H / 2, k * .92, W / 2, H / 2, k * 1.28);
        g.addColorStop(0, 'rgba(201,162,91,.22)');
        g.addColorStop(1, 'rgba(201,162,91,0)');
        c.fillStyle = g;
        c.beginPath(); c.arc(W / 2, H / 2, k * 1.28, 0, Math.PI * 2); c.fill();
      }

      // océano
      c.beginPath(); path({ type: 'Sphere' });
      c.fillStyle = '#2B1F19'; c.fill();

      // retícula
      c.beginPath(); path(graticule);
      c.strokeStyle = 'rgba(201,162,91,.13)'; c.lineWidth = .6; c.stroke();

      if (land) {
        c.beginPath(); path(land);
        c.fillStyle = '#CDB999'; c.fill();
        c.beginPath(); path(borders);
        c.strokeStyle = 'rgba(30,21,17,.35)'; c.lineWidth = .7; c.stroke();
      }

      if (colombia) {
        const a = smooth(.28, .42, p);
        if (a > 0) {
          c.save();
          c.globalAlpha = a;
          c.beginPath(); path(colombia);
          c.fillStyle = '#C45A45'; c.fill();
          // al acercarse, el rojo se oscurece hacia tierra de montaña
          const deep = smooth(.66, .9, p);
          if (deep > 0) { c.globalAlpha = a * deep * .55; c.fillStyle = '#5A2A20'; c.fill(); c.globalAlpha = a; }
          c.strokeStyle = '#E6D3A6'; c.lineWidth = 1.4; c.stroke();
          c.restore();
        }
      }

      // curvas de nivel de la cordillera
      const ca = smooth(.64, .8, p);
      if (ca > 0) {
        c.save();
        c.globalAlpha = ca;
        c.lineWidth = .8;
        CONTOURS.forEach((ring) => {
          c.beginPath();
          path(ring.geo);
          c.strokeStyle = ring.strong ? 'rgba(230,211,166,.3)' : 'rgba(251,247,240,.12)';
          c.stroke();
        });
        c.restore();
      }

      // contorno de la esfera
      c.beginPath(); path({ type: 'Sphere' });
      c.strokeStyle = 'rgba(230,211,166,.35)'; c.lineWidth = 1; c.stroke();

      const visibleAt = (ll) => d3.geoDistance(ll, center) < Math.PI / 2 - .01;

      // etiqueta del departamento
      const ta = smooth(.62, .7, p) * (1 - smooth(.9, .97, p) * .6);
      if (ta > 0) {
        const pt = projection([-75.05, 4.05]);
        if (pt) {
          c.save();
          c.globalAlpha = ta;
          c.font = '600 ' + Math.round(clamp(W / 70, 11, 16)) + 'px "Cormorant Garamond", serif';
          c.fillStyle = 'rgba(251,247,240,.85)';
          c.textAlign = 'center';
          if (c.letterSpacing !== undefined) c.letterSpacing = '8px';
          c.fillText('T O L I M A', pt[0], pt[1]);
          c.restore();
        }
      }

      // lugares de referencia
      const pa = smooth(.7, .8, p);
      if (pa > 0) {
        c.save();
        c.globalAlpha = pa;
        c.font = 'italic 500 ' + Math.round(clamp(W / 90, 13, 17)) + 'px "Cormorant Garamond", serif';
        PLACES.forEach((pl) => {
          if (!visibleAt(pl.c)) return;
          const pt = projection(pl.c);
          if (!pt || pt[0] < 10 || pt[0] > W - 10 || pt[1] < 10 || pt[1] > H - 10) return;
          c.fillStyle = 'rgba(251,247,240,.9)';
          c.strokeStyle = 'rgba(251,247,240,.9)';
          if (pl.peak) {
            c.beginPath();
            c.moveTo(pt[0], pt[1] - 7); c.lineTo(pt[0] + 7, pt[1] + 5); c.lineTo(pt[0] - 7, pt[1] + 5); c.closePath();
            c.lineWidth = 1; c.stroke();
          } else {
            c.beginPath(); c.arc(pt[0], pt[1], 3, 0, Math.PI * 2); c.fill();
          }
          c.textAlign = 'left';
          c.fillText(pl.n, pt[0] + 10, pt[1] + 4);
        });
        c.restore();
      }

      // Planadas
      const ma = smooth(.52, .62, p);
      if (ma > 0 && visibleAt(PLAN)) {
        const pt = projection(PLAN);
        if (pt) {
          c.save();
          c.globalAlpha = ma;
          for (let i = 0; i < 3; i++) {
            const ph = ((t / 2400) + i / 3) % 1;
            c.beginPath();
            c.arc(pt[0], pt[1], 6 + ph * 46, 0, Math.PI * 2);
            c.strokeStyle = 'rgba(230,211,166,' + (1 - ph) * .7 + ')';
            c.lineWidth = 1;
            c.stroke();
          }
          c.beginPath(); c.arc(pt[0], pt[1], 5.5, 0, Math.PI * 2);
          c.fillStyle = '#E2B84C'; c.fill();
          c.beginPath(); c.arc(pt[0], pt[1], 2, 0, Math.PI * 2);
          c.fillStyle = '#1E1511'; c.fill();
          const la = smooth(.8, .88, p);
          if (la > 0) {
            c.globalAlpha = ma * la;
            c.strokeStyle = 'rgba(230,211,166,.7)';
            c.beginPath(); c.moveTo(pt[0] + 8, pt[1] - 8); c.lineTo(pt[0] + 60, pt[1] - 60); c.lineTo(pt[0] + 150, pt[1] - 60); c.stroke();
            c.font = 'italic 500 ' + Math.round(clamp(W / 50, 18, 30)) + 'px "Cormorant Garamond", serif';
            c.fillStyle = '#FBF7F0';
            c.textAlign = 'left';
            c.fillText('Planadas', pt[0] + 64, pt[1] - 70);
          }
          c.restore();
        }
      }

      // HUD
      hudLat.textContent = fmt(center[1], 'N', 'S');
      hudLon.textContent = fmt(center[0], 'E', T('dir.W'));
      hudAlt.textContent = Math.round(6371 * 2.3 * base / k).toLocaleString(LOCALE()) + ' km';

      // textos por etapa
      caps.forEach((cp) => {
        const inA = cp.from <= 0 ? 1 : smooth(cp.from, cp.from + .035, p);
        const outA = cp.to >= 1 ? 0 : smooth(cp.to - .035, cp.to, p);
        const a = inA * (1 - outA);
        const ty = (1 - inA) * 24 - outA * 24;
        cp.el.style.opacity = a;
        cp.el.style.transform = 'translateY(' + ty + 'px)';
      });
    }

    function loop(t) {
      prog = reduced ? target : lerp(prog, target, .1);
      draw(prog, t);
      if (visible) requestAnimationFrame(loop);
      else running = false;
    }

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => { target = self.progress; }
    });
    // animar solo cuando el globo está en pantalla
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible && !running) { running = true; requestAnimationFrame(loop); }
    }).observe(section);
    draw(0, 0);
  }

  /* =======================================================
     10. MANIFIESTO + parallax general
     ======================================================= */
  // un párrafo por idioma; cada uno con su propio revelado
  $$('.manifesto__text').forEach((p) => {
    gsap.to($$('.w', p), {
      opacity: 1, stagger: .1, ease: 'none',
      scrollTrigger: { trigger: p, start: 'top 82%', end: 'bottom 45%', scrub: true }
    });
  });
  $$('[data-speed]').forEach((el) => {
    const s = parseFloat(el.dataset.speed);
    gsap.fromTo(el, { yPercent: -s * 100 }, {
      yPercent: s * 100, ease: 'none',
      scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
  // imagen interior de cada foto (parallax dentro del marco)
  $$('.ph__img').forEach((img) => {
    const fig = img.parentElement;
    if (fig.closest('.hero, .routes, .index, .culture__stack, .plaza__intro') || fig.id === 'dishFloat') return;
    gsap.fromTo(img, { yPercent: -7 }, {
      yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* =======================================================
     11. MARQUESINA (reacciona a la velocidad del scroll)
     ======================================================= */
  const mTrack = $('.marquee__track');
  if (mTrack && !reduced) {
    let mx = 0, dir = 1;
    gsap.ticker.add(() => {
      const half = mTrack.scrollWidth / 2;
      if (Math.abs(scrollVel) > .5) dir = scrollVel > 0 ? 1 : -1;
      mx -= (.6 + Math.min(Math.abs(scrollVel), 40) * .35) * dir;
      if (mx <= -half) mx += half;
      if (mx > 0) mx -= half;
      mTrack.style.transform = 'translate3d(' + mx + 'px,0,0)';
      scrollVel *= .92;
    });
  }

  /* =======================================================
     12. RUTAS — recorrido horizontal
     ======================================================= */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
    const section = $('.routes');
    const track = $('.routes__track');
    const svg = $('.routes__path');
    const pathEl = $('#routesPath');
    let len = 0;
    const dist = () => track.scrollWidth - innerWidth;

    function buildPath() {
      const w = track.scrollWidth, h = track.offsetHeight;
      svg.setAttribute('width', w); svg.setAttribute('height', h);
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      const x0 = $('.routes__intro').offsetWidth * .4;
      const period = innerWidth * 1.46;
      let d = '';
      for (let x = x0; x <= w - 120; x += 24) {
        const y = h * (.52 + .34 * Math.sin(((x - x0) / period) * Math.PI * 2 + .6));
        d += (d ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      }
      pathEl.setAttribute('d', d);
      len = pathEl.getTotalLength();
      pathEl.style.strokeDasharray = len;
    }
    buildPath();

    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: section, pin: true, scrub: 1, start: 'top top',
        end: () => '+=' + dist(),
        invalidateOnRefresh: true,
        onRefresh: buildPath,
        onUpdate: (self) => { pathEl.style.strokeDashoffset = len * (1 - self.progress); }
      }
    });

    $$('.route').forEach((r) => {
      const img = $('.ph__img', r);
      gsap.fromTo(img, { xPercent: -7 }, {
        xPercent: 7, ease: 'none',
        scrollTrigger: { trigger: r, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true }
      });
      gsap.from($('.route__ph', r), {
        clipPath: 'inset(0 0 0 100%)', duration: 1.4, ease: 'expo.inOut',
        scrollTrigger: { trigger: r, containerAnimation: tween, start: 'left 85%' }
      });
      gsap.from($$('.route__body > *', r), {
        y: 40, opacity: 0, duration: 1.1, stagger: .08, ease: 'expo.out',
        scrollTrigger: { trigger: r, containerAnimation: tween, start: 'left 70%' }
      });
    });
    return () => { pathEl.removeAttribute('d'); };
  });
  mm.add('(max-width: 900px)', () => {
    $$('.route').forEach((r) => {
      gsap.from($$('.route__body > *', r), {
        y: 30, opacity: 0, duration: 1, stagger: .08, ease: 'expo.out',
        scrollTrigger: { trigger: r, start: 'top 75%' }
      });
    });
  });

  /* =======================================================
     13. CINE — el video se abre como una ventana
     ======================================================= */
  const cinema = $('.cinema');
  const video = $('#cinemaVideo');
  const vBtn = $('#videoSound');
  if (cinema) {
    const narrow = () => innerWidth < 900;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cinema, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true,
        onUpdate: (self) => {
          const dark = self.isActive && self.progress > .35;
          $('#topbar').classList.toggle('is-dark', dark);
          $('#soundBtn').classList.toggle('is-dark', dark);
        },
        onToggle: (self) => {
          if (self.isActive) return;
          $('#topbar').classList.remove('is-dark');
          $('#soundBtn').classList.remove('is-dark');
        }
      }
    });
    tl.fromTo('.cinema__media',
      { clipPath: () => narrow() ? 'inset(28% 14% 28% 14% round 999px)' : 'inset(22% 30% 22% 30% round 999px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 1 })
      .fromTo(video, { scale: 1.3 }, { scale: 1, ease: 'none', duration: 1 }, 0)
      .to('.cinema__l', { xPercent: () => narrow() ? 0 : -6, ease: 'none', duration: 1 }, 0)
      .to('.cinema__r', { xPercent: () => narrow() ? 0 : 6, ease: 'none', duration: 1 }, 0)
      .to('.cinema__title', { color: '#FBF7F0', duration: .25 }, .3)
      .to('.cinema__foot', { opacity: 1, duration: .2 }, .75)
      .to({}, { duration: .25 });

    ScrollTrigger.create({
      trigger: cinema, start: 'top bottom', end: 'bottom top',
      onToggle: (self) => {
        if (self.isActive) video.play().catch(() => {});
        else {
          video.pause();
          if (!video.muted) setVideoSound(false);
        }
      }
    });
  }
  function setVideoSound(on) {
    video.muted = !on;
    vBtn.setAttribute('aria-pressed', on);
    vBtn.textContent = T(on ? 'film.mute' : 'film.play');
  }
  if (vBtn) vBtn.addEventListener('click', () => setVideoSound(video.muted));
  if (vBtn && I18) I18.onChange(() => { vBtn.textContent = T(video.muted ? 'film.play' : 'film.mute'); });

  /* =======================================================
     13b. PARQUE CENTRAL
     ======================================================= */
  const plaza = $('.plaza__intro');
  if (plaza) {
    const narrowP = () => innerWidth < 900;
    const tlP = gsap.timeline({
      scrollTrigger: {
        trigger: plaza, start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true,
        onUpdate: (self) => {
          const dark = self.isActive && self.progress > .45;
          $('#topbar').classList.toggle('is-dark', dark);
          $('#soundBtn').classList.toggle('is-dark', dark);
          $('.rail').classList.toggle('is-dark', dark);
        },
        onToggle: (self) => {
          if (self.isActive) return;
          $('#topbar').classList.remove('is-dark');
          $('#soundBtn').classList.remove('is-dark');
          $('.rail').classList.remove('is-dark');
        }
      }
    });
    tlP.fromTo('.plaza__window',
        { width: () => narrowP() ? '64vw' : '30vw', height: () => narrowP() ? '52vh' : '64vh', borderRadius: '50vw 50vw 0vw 0vw' },
        { width: '100vw', height: '100vh', borderRadius: '0vw 0vw 0vw 0vw', ease: 'power2.inOut', duration: 1 })
      .fromTo('.plaza__img .ph__img', { scale: 1.35 }, { scale: 1, ease: 'none', duration: 1 }, 0)
      .to('.plaza__veil', { opacity: 1, duration: .5 }, .4)
      .to('.plaza__t1', { xPercent: () => narrowP() ? 0 : -4, yPercent: -30, color: '#FBF7F0', ease: 'none', duration: 1 }, 0)
      .to('.plaza__t2', { xPercent: () => narrowP() ? 0 : 4, yPercent: 30, ease: 'none', duration: 1 }, 0)
      .to('.plaza__t2 em', { color: '#E6D3A6', duration: .3 }, .35)
      .to('.plaza__eyebrow, .plaza__coords', { color: '#E6D3A6', duration: .3 }, .35)
      .to('.plaza__caption', { opacity: 1, y: 0, duration: .25 }, .75)
      .to({}, { duration: .2 });
    gsap.set('.plaza__caption', { y: 30 });
  }

  // galería: luz que sigue el cursor y piezas con parallax
  const gal = $('#parqueGaleria');
  if (gal) {
    if (finePointer) {
      gal.addEventListener('mousemove', (e) => {
        const r = gal.getBoundingClientRect();
        gal.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        gal.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    }
    $$('.piece', gal).forEach((pc, i) => {
      gsap.from($('.piece__frame', pc), {
        clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'expo.inOut',
        scrollTrigger: { trigger: pc, start: 'top 85%' }
      });
      gsap.from($('.piece__plate', pc), {
        y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', delay: .3,
        scrollTrigger: { trigger: pc, start: 'top 80%' }
      });
      if (innerWidth > 900 && !reduced) {
        gsap.fromTo(pc, { y: (i % 2 ? -1 : 1) * 50 }, {
          y: (i % 2 ? 1 : -1) * 50, ease: 'none',
          scrollTrigger: { trigger: gal, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
    });
  }

  // iglesia: foto que se revela y campana
  gsap.from('.church__ph', {
    clipPath: 'inset(0 0 100% 0)', duration: 1.6, ease: 'expo.inOut',
    scrollTrigger: { trigger: '.plaza__church', start: 'top 75%' }
  });
  gsap.from('.plaza__tips li', {
    x: 40, opacity: 0, duration: 1, stagger: .1, ease: 'expo.out',
    scrollTrigger: { trigger: '.plaza__tips', start: 'top 85%' }
  });
  const bellBtn = $('#bellBtn');
  const ringBell = () => {
    if (!Sound || !Sound.bell) return;
    Sound.bell();
    bellBtn.classList.remove('is-ringing');
    void bellBtn.offsetWidth;
    bellBtn.classList.add('is-ringing');
  };
  if (bellBtn) bellBtn.addEventListener('click', ringBell);
  ScrollTrigger.create({
    trigger: '.plaza__church', start: 'top 60%', once: true,
    onEnter: () => { if (Sound && Sound.isOn()) ringBell(); }
  });

  /* =======================================================
     14. CULTURA — la foto cambia con cada capítulo
     ======================================================= */
  const cPhs = $$('.culture__ph');
  const cIdx = $('#cultureIdx');
  let cActive = 0;
  function setCulture(i) {
    if (i === cActive || !cPhs[i]) return;
    cPhs.forEach((p) => p.classList.remove('was-active'));
    cPhs[cActive].classList.remove('is-active');
    cPhs[cActive].classList.add('was-active');
    const el = cPhs[i];
    el.style.transition = 'none';
    el.classList.remove('is-active', 'was-active');
    void el.offsetWidth;
    el.style.transition = '';
    el.classList.add('is-active');
    cActive = i;
    cIdx.textContent = String(i + 1).padStart(2, '0');
  }
  $$('.culture__item').forEach((item, i) => {
    ScrollTrigger.create({
      trigger: item, start: 'top 55%', end: 'bottom 55%',
      onToggle: (self) => { if (self.isActive) setCulture(i); }
    });
  });

  /* =======================================================
     15. COMIDA y EVENTOS — foto flotante que sigue al cursor
     ======================================================= */
  function floatPreview(items, floatEl) {
    if (!finePointer || !floatEl) return;
    const xTo = gsap.quickTo(floatEl, 'x', { duration: .7, ease: 'power3' });
    const yTo = gsap.quickTo(floatEl, 'y', { duration: .7, ease: 'power3' });
    const rTo = gsap.quickTo(floatEl, 'rotation', { duration: .9, ease: 'power3' });
    let lastX = 0;
    items.forEach((it) => {
      it.addEventListener('mouseenter', () => {
        fillPh(floatEl, it.dataset.src, it.dataset.label);
        gsap.to(floatEl, { opacity: 1, scale: 1, duration: .6, ease: 'expo.out' });
      });
      it.addEventListener('mouseleave', () => gsap.to(floatEl, { opacity: 0, scale: .6, duration: .5, ease: 'expo.out' }));
      it.addEventListener('mousemove', (e) => {
        xTo(e.clientX); yTo(e.clientY);
        rTo(clamp((e.clientX - lastX) * .6, -12, 12));
        lastX = e.clientX;
      });
    });
    gsap.set(floatEl, { xPercent: -50, yPercent: -50, x: innerWidth / 2, y: innerHeight / 2, scale: .6 });
  }
  floatPreview($$('.dish'), $('#dishFloat'));

  const tFloat = document.createElement('figure');
  tFloat.className = 'ph ticket-float';
  tFloat.setAttribute('aria-hidden', 'true');
  tFloat.innerHTML = '<div class="ph__img"></div>';
  document.body.appendChild(tFloat);
  floatPreview($$('.ticket'), tFloat);

  const cup = $('.cupping');
  if (cup) ScrollTrigger.create({ trigger: cup, start: 'top 80%', once: true, onEnter: () => cup.classList.add('is-in') });

  gsap.from('.dish', {
    y: 30, opacity: 0, duration: 1, stagger: .06, ease: 'expo.out',
    scrollTrigger: { trigger: '.menu', start: 'top 75%' }
  });
  gsap.from('.ticket', {
    x: -60, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out',
    scrollTrigger: { trigger: '.tickets', start: 'top 78%' }
  });

  /* =======================================================
     16. POSTALES APILADAS
     ======================================================= */
  const cards = $$('.postcard');
  cards.forEach((card, i) => {
    card.style.setProperty('--i', i);
    const next = cards[i + 1];
    if (!next) return;
    gsap.to(card, {
      scale: .9, rotation: i % 2 ? 1.6 : -1.6, ease: 'none',
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 25%', scrub: true }
    });
  });

  /* =======================================================
     17. REVELADOS GENERALES
     ======================================================= */
  $$('.display, .lede, section .label, .fact, .contact__data p, .routes-list li, .events__note, .map__frame, .letter, .contact__big, .footer__brand, .footer__col')
    .filter((el) => !el.closest('.globe, .loader, .index, .routes, .cinema'))
    .forEach((el) => {
      gsap.from(el, {
        y: 50, opacity: 0, duration: 1.3, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
  gsap.from('.footer__word', {
    yPercent: 40, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true }
  });

  /* =======================================================
     18. SECCIONES — rail lateral, colores y ambiente sonoro
     ======================================================= */
  const railNum = $('#railNum'), railName = $('#railName'), railProg = $('#railProg');
  let railSec = null;
  if (I18) I18.onChange(() => { if (railSec) railName.textContent = railSec.dataset.section; });
  const topbar = $('#topbar'), soundBtn = $('#soundBtn'), rail = $('.rail');

  $$('[data-section]').forEach((sec) => {
    // si la sección está fijada (pin), medir con su contenedor
    const trg = sec.parentElement.classList.contains('pin-spacer') ? sec.parentElement : sec;
    ScrollTrigger.create({
      trigger: trg, start: 'top 50%', end: 'bottom 50%',
      onToggle: (self) => {
        if (!self.isActive) return;
        if (railNum.textContent !== sec.dataset.num || railName.textContent !== sec.dataset.section) {
          gsap.fromTo([railNum, railName], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .6, ease: 'expo.out' });
        }
        railNum.textContent = sec.dataset.num;
        railName.textContent = sec.dataset.section;
        railSec = sec;
        if (Sound && sec.dataset.ambience) Sound.setScene(sec.dataset.ambience);
      }
    });
  });

  // fondos oscuros: cambiar el color de los controles fijos
  $$('.globe, .plaza__gallery, .food, .map, .footer').forEach((sec) => {
    ScrollTrigger.create({ trigger: sec, start: 'top 40px', end: 'bottom 40px', toggleClass: { targets: topbar, className: 'is-dark' } });
    ScrollTrigger.create({ trigger: sec, start: 'top bottom-=70', end: 'bottom bottom-=70', toggleClass: { targets: soundBtn, className: 'is-dark' } });
    ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', toggleClass: { targets: rail, className: 'is-dark' } });
  });

  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      railProg.style.transform = 'scaleY(' + self.progress + ')';
      if (!menuOpen) topbar.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > innerHeight * .8);
    }
  });

  initSoundUI();
  initForm();

  if (I18) I18.onChange(() => { renderDate(); setTimeout(() => ScrollTrigger.refresh(), 60); });
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());

  /* =======================================================
     SONIDO — botón
     ======================================================= */
  function initSoundUI() {
    const btn = $('#soundBtn');
    if (!btn || !Sound) { if (btn) btn.hidden = true; return; }
    const st = $('#soundState'), sc = $('#soundScene');
    let last = { enabled: false, key: 'forest' };
    const paint = () => {
      btn.classList.toggle('is-on', last.enabled);
      btn.setAttribute('aria-pressed', last.enabled);
      st.textContent = T(last.enabled ? 'sound.on' : 'sound.off');
      sc.textContent = T('scene.' + last.key);
    };
    Sound.onChange((s) => { last = s; paint(); });
    if (I18) I18.onChange(paint);
    btn.addEventListener('click', () => Sound.toggle());
  }

  /* =======================================================
     CONTACTO — la carta
     Para recibir los mensajes en un servidor (Formspree,
     Google Forms, etc.) reemplaza el bloque "mailto".
     ======================================================= */
  function initForm() {
    const form = $('#letter');
    if (!form) return;
    const ok = $('#letterOk');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.nombre, mail = form.correo;
      let valid = true;
      [name, mail].forEach((f) => {
        const bad = !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
        f.classList.toggle('is-invalid', bad);
        if (bad) valid = false;
      });
      if (!valid) { (name.classList.contains('is-invalid') ? name : mail).focus(); return; }

      const intereses = $$('input[name="interes"]:checked', form).map((i) => i.value).join(', ') || '—';
      const body =
        T('mail.name') + ': ' + name.value + '\n' +
        T('mail.email') + ': ' + mail.value + '\n' +
        T('mail.date') + ': ' + (form.fecha.value || '—') + '\n' +
        T('mail.people') + ': ' + (form.personas.value || '—') + '\n' +
        T('mail.interests') + ': ' + intereses + '\n\n' + (form.mensaje.value || '');
      window.location.href = 'mailto:hola@visitaplanadas.co?subject=' +
        encodeURIComponent(T('mail.subject') + ' — ' + name.value) + '&body=' + encodeURIComponent(body);

      ok.hidden = false;
      if (window.gsap) {
        gsap.fromTo('.btn-seal', { rotation: 0, scale: 1 }, { rotation: -360, scale: .9, duration: 1.2, ease: 'expo.inOut' });
        gsap.from(ok, { opacity: 0, x: -20, duration: .8, delay: .4 });
      }
      form.reset();
    });
  }

  /* =======================================================
     IDIOMA — botón ES / EN
     ======================================================= */
  function initLang() {
    const b = $('#langBtn');
    if (!b || !I18) { if (b) b.hidden = true; return; }
    b.addEventListener('click', () => I18.set(I18.lang === 'es' ? 'en' : 'es'));
  }

  /* =======================================================
     CLIMA EN VIVO — Open-Meteo (gratis, sin clave)
     ======================================================= */
  const WX_ICONS = {
    sun: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="8"/><path d="M24 6v5M24 37v5M6 24h5M37 24h5M11.3 11.3l3.5 3.5M33.2 33.2l3.5 3.5M11.3 36.7l3.5-3.5M33.2 14.8l3.5-3.5"/></svg>',
    moon: '<svg viewBox="0 0 48 48"><path d="M31 8a16 16 0 1 0 9 26A13 13 0 0 1 31 8z"/></svg>',
    partly: '<svg viewBox="0 0 48 48"><circle cx="18" cy="17" r="6"/><path d="M18 5v3M6 17h3M9.5 8.5l2 2M26.5 8.5l-2 2"/><path d="M15 38h20a7 7 0 0 0 0-14 10 10 0 0 0-19 3 5.5 5.5 0 0 0-1 11z"/></svg>',
    cloud: '<svg viewBox="0 0 48 48"><path d="M13 36h22a8 8 0 0 0 0-16 11 11 0 0 0-21 3 6.5 6.5 0 0 0-1 13z"/></svg>',
    fog: '<svg viewBox="0 0 48 48"><path d="M13 26h22a7 7 0 0 0 0-14 10 10 0 0 0-19 3 5.5 5.5 0 0 0-3 11z"/><path d="M8 32h32M12 38h24"/></svg>',
    drizzle: '<svg viewBox="0 0 48 48"><path d="M13 28h22a7 7 0 0 0 0-14 10 10 0 0 0-19 3 5.5 5.5 0 0 0-3 11z"/><path d="M17 34l-1 3M25 34l-1 3M33 34l-1 3"/></svg>',
    rain: '<svg viewBox="0 0 48 48"><path d="M13 26h22a7 7 0 0 0 0-14 10 10 0 0 0-19 3 5.5 5.5 0 0 0-3 11z"/><path d="M16 31l-2 6M24 31l-2 6M32 31l-2 6M20 39l-1 3M28 39l-1 3"/></svg>',
    storm: '<svg viewBox="0 0 48 48"><path d="M13 26h22a7 7 0 0 0 0-14 10 10 0 0 0-19 3 5.5 5.5 0 0 0-3 11z"/><path d="M25 28l-5 8h6l-4 8"/></svg>'
  };
  const WX_CODES = [0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
  function wxKind(code, day) {
    if (code === 0) return day ? 'sun' : 'moon';
    if (code <= 2) return 'partly';
    if (code === 3) return 'cloud';
    if (code === 45 || code === 48) return 'fog';
    if (code >= 51 && code <= 57) return 'drizzle';
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
    if (code >= 95) return 'storm';
    return 'cloud';
  }
  function wxText(code) {
    if (WX_CODES.includes(code)) return T('wx.' + code);
    return T(code >= 71 && code <= 86 ? 'wx.snow' : 'wx.3');
  }

  function initWeather() {
    const box = $('#wx'), chip = $('#wxChip');
    if (!box) return;
    let data = null;
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=3.197&longitude=-75.644&elevation=1450' +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
      '&timezone=America%2FBogota&forecast_days=5';

    function render() {
      const now = new Date();
      $('#wxTime').textContent = now.toLocaleTimeString(LOCALE(), { hour: 'numeric', minute: '2-digit', timeZone: 'America/Bogota' }) + ' · ' + T('wx.local');
      // mes actual en el calendario de temporadas
      const m = +now.toLocaleString('en-US', { month: 'numeric', timeZone: 'America/Bogota' }) - 1;
      const mark = $('#seasonNow');
      if (mark) { mark.style.setProperty('--m', m); mark.dataset.label = T('wx.now'); }
      if (!data) return;
      const c = data.current, d = data.daily;
      const kind = wxKind(c.weather_code, c.is_day);
      $('#wxIcon').innerHTML = WX_ICONS[kind];
      $('#wxTemp').textContent = Math.round(c.temperature_2m);
      $('#wxText').textContent = wxText(c.weather_code);
      $('#wxFeels').textContent = Math.round(c.apparent_temperature) + '°C';
      $('#wxHum').textContent = Math.round(c.relative_humidity_2m) + '%';
      $('#wxWind').textContent = Math.round(c.wind_speed_10m) + ' km/h';
      const p0 = d.precipitation_probability_max[0];
      $('#wxRain').textContent = (p0 == null ? '—' : p0) + '%';
      $('#wxDays').innerHTML = d.time.map((day, i) => {
        const name = i === 0 ? T('wx.today') : new Date(day + 'T12:00:00-05:00').toLocaleDateString(LOCALE(), { weekday: 'short', timeZone: 'America/Bogota' }).replace('.', '');
        const p = d.precipitation_probability_max[i];
        return '<li><span class="d">' + name + '</span>' + WX_ICONS[wxKind(d.weather_code[i], 1)] +
          '<span class="t">' + Math.round(d.temperature_2m_max[i]) + '°<small>' + Math.round(d.temperature_2m_min[i]) + '°</small></span>' +
          '<span class="p">' + (p == null ? 0 : p) + '% ' + T('wx.rainShort') + '</span></li>';
      }).join('');
      if (chip) {
        chip.hidden = false;
        $('#wxChipIcon').innerHTML = WX_ICONS[kind];
        $('#wxChipTemp').textContent = Math.round(c.temperature_2m) + '°';
        $('#wxChipText').textContent = T('wx.chip');
        chip.title = wxText(c.weather_code) + ' · Planadas';
      }
    }
    function load() {
      fetch(url).then((r) => r.json()).then((j) => {
        if (!j || !j.current) throw new Error('sin datos');
        data = j;
        box.classList.remove('is-error');
        render();
      }).catch(() => {
        box.classList.add('is-error');
        $('#wxText').textContent = T('wx.error');
        render();
      });
    }
    load();
    setInterval(load, 15 * 60 * 1000);
    setInterval(render, 60 * 1000);
    if (I18) I18.onChange(() => {
      render();
      if (!data) $('#wxText').textContent = T(box.classList.contains('is-error') ? 'wx.error' : 'wx.loading');
    });
  }

  /* =======================================================
     MALETA — lista que se guarda en el navegador
     ======================================================= */
  function initPack() {
    const list = $('#packList');
    if (!list) return;
    const KEY = 'planadas-maleta';
    const boxes = $$('input', list);
    let saved = [];
    try { saved = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { saved = []; }
    boxes.forEach((b) => { b.checked = saved.includes(b.value); });
    const update = () => {
      const done = boxes.filter((b) => b.checked);
      $('#packCount').textContent = done.length;
      $('#packTotal').textContent = boxes.length;
      $('.pack').classList.toggle('is-done', done.length === boxes.length);
      try { localStorage.setItem(KEY, JSON.stringify(done.map((b) => b.value))); } catch (e) { /* sin almacenamiento */ }
    };
    boxes.forEach((b) => b.addEventListener('change', update));
    update();
  }
})();
