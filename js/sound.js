/* =========================================================
   PAISAJE SONORO · Planadas
   - Grabaciones reales (carpeta audio/) para bosque, río y música.
   - Viento y fogón generados con Web Audio.
   Para cambiar un sonido, reemplaza el archivo o la ruta en FILES.
   ========================================================= */
window.Soundscape = (function () {
  'use strict';

  // escena -> grabaciones que suenan juntas (archivo, volumen)
  const FILES = {
    forest: [['audio/bosque.mp3', .55]],
    plaza: [['audio/bosque.mp3', .3]],
    river: [['audio/rio.mp3', .5], ['audio/bosque.mp3', .12]],
    strings: [['audio/cuerdas-1922.mp3', .5]],
    fire: [],
    wind: [],
    none: []
  };
  // escena -> capas sintetizadas (nombre, volumen)
  const SYNTH = {
    forest: [['breeze', .35]],
    plaza: [['breeze', .25], ['bells', .8]],
    river: [],
    strings: [],
    fire: [['fire', .9]],
    wind: [['wind', .75]],
    none: []
  };
  const SCENES = {
    forest: 'Mirlas del bosque de niebla',
    plaza: 'Campanas del parque',
    wind: 'Viento de cordillera',
    river: 'Quebrada de montaña',
    strings: '«Ingrata» · Jorge Áñez, 1922',
    fire: 'Fogón de leña',
    none: 'Película'
  };

  let ctx = null, master = null;
  let enabled = false;
  let current = 'forest';
  let timer = null;
  const synth = {};
  const tracks = {};
  const listeners = [];
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------- grabaciones (HTMLAudio con fundidos) ---------- */
  function track(src) {
    if (!tracks[src]) {
      const el = new Audio(src);
      el.loop = true;
      el.preload = 'auto';
      el.volume = 0;
      tracks[src] = { el, vol: 0, target: 0 };
    }
    return tracks[src];
  }
  Object.values(FILES).forEach((list) => list.forEach(([src]) => track(src)));

  let fadeRaf = null;
  function fadeStep() {
    let moving = false;
    Object.values(tracks).forEach((t) => {
      const d = t.target - t.vol;
      if (Math.abs(d) > .004) {
        t.vol += Math.sign(d) * Math.min(Math.abs(d), .012);
        moving = true;
      } else t.vol = t.target;
      try { t.el.volume = Math.max(0, Math.min(1, t.vol)); } catch (e) { /* iOS */ }
      if (t.vol <= 0 && t.target === 0 && !t.el.paused) t.el.pause();
    });
    fadeRaf = moving ? requestAnimationFrame(fadeStep) : null;
  }
  function applyTracks() {
    const want = {};
    if (enabled) (FILES[current] || []).forEach(([src, v]) => { want[src] = Math.max(want[src] || 0, v); });
    Object.entries(tracks).forEach(([src, t]) => {
      t.target = want[src] || 0;
      if (t.target > 0 && t.el.paused) {
        const pr = t.el.play();
        if (pr && pr.catch) pr.catch(() => {});
      }
    });
    if (!fadeRaf) fadeRaf = requestAnimationFrame(fadeStep);
  }

  /* ---------- síntesis ---------- */
  function noiseBuffer(kind, seconds) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        if (kind === 'pink') {
          b0 = .99886 * b0 + w * .0555179; b1 = .99332 * b1 + w * .0750759;
          b2 = .969 * b2 + w * .153852; b3 = .8665 * b3 + w * .3104856;
          b4 = .55 * b4 + w * .5329522; b5 = -.7616 * b5 - w * .016898;
          d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * .5362) * .11;
          b6 = w * .115926;
        } else if (kind === 'brown') {
          last = (last + .02 * w) / 1.02;
          d[i] = last * 3.5;
        } else d[i] = w;
      }
    }
    return buf;
  }
  function loopNoise(buffer) {
    const s = ctx.createBufferSource();
    s.buffer = buffer; s.loop = true;
    s.start(0, Math.random() * buffer.duration);
    return s;
  }
  function lfo(freq, depth, param) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = freq; g.gain.value = depth;
    o.connect(g).connect(param); o.start();
  }
  function layer(name) {
    const out = ctx.createGain();
    out.gain.value = 0;
    out.connect(master);
    synth[name] = { out, tick: null };
    return synth[name];
  }

  // viento: dos bandas de ruido con ráfagas lentas y un silbido resonante
  function buildWind(pink, brown) {
    const L = layer('wind');
    const low = loopNoise(brown);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 320;
    const gl = ctx.createGain(); gl.gain.value = .5;
    low.connect(lp).connect(gl).connect(L.out);
    lfo(.05, .25, gl.gain);

    const hi = loopNoise(pink);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 700; bp.Q.value = 3.5;
    const gh = ctx.createGain(); gh.gain.value = .0;
    hi.connect(bp).connect(gh).connect(L.out);
    L.tick = (now) => {
      // ráfaga: sube y baja el silbido y la frecuencia
      if (Math.random() < .12) {
        const dur = rand(2.5, 6);
        gh.gain.cancelScheduledValues(now);
        gh.gain.setTargetAtTime(rand(.12, .28), now, dur * .3);
        gh.gain.setTargetAtTime(.02, now + dur * .6, dur * .35);
        bp.frequency.setTargetAtTime(rand(450, 1100), now, dur * .4);
        gl.gain.setTargetAtTime(rand(.5, .8), now, dur * .3);
        gl.gain.setTargetAtTime(.4, now + dur * .6, dur * .4);
      }
    };
  }

  // brisa suave bajo los pájaros
  function buildBreeze(pink) {
    const L = layer('breeze');
    const n = loopNoise(pink);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 500; bp.Q.value = .6;
    const g = ctx.createGain(); g.gain.value = .18;
    n.connect(bp).connect(g).connect(L.out);
    lfo(.07, .08, g.gain);
    lfo(.04, 180, bp.frequency);
  }

  // fogón: rumor grave, siseo, chasquidos y estallidos de leña
  function buildFire(brown, white, pink) {
    const L = layer('fire');
    const r = loopNoise(brown);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 180;
    const gr = ctx.createGain(); gr.gain.value = .55;
    r.connect(lp).connect(gr).connect(L.out);
    lfo(.23, .18, gr.gain);

    const h = loopNoise(pink);
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 3500;
    const gs = ctx.createGain(); gs.gain.value = .035;
    h.connect(hp).connect(gs).connect(L.out);
    lfo(.5, .015, gs.gain);

    const crackBus = ctx.createBiquadFilter(); crackBus.type = 'highpass'; crackBus.frequency.value = 900;
    crackBus.connect(L.out);
    const snap = (t, big) => {
      const s = ctx.createBufferSource(); s.buffer = white;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = rand(1500, 5200); f.Q.value = rand(.6, 2.5);
      const g = ctx.createGain();
      const v = big ? rand(.5, .9) : rand(.05, .22);
      const d = big ? rand(.03, .08) : rand(.004, .018);
      g.gain.setValueAtTime(v, t);
      g.gain.exponentialRampToValueAtTime(.0001, t + d);
      let node = s.connect(f).connect(g);
      if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = rand(-.6, .6); node = node.connect(p); }
      node.connect(crackBus);
      s.start(t, rand(0, 2)); s.stop(t + d + .02);
    };
    L.tick = (now) => {
      // ráfagas de chasquidos agrupados, como la leña real
      if (Math.random() < .55) {
        const n = Math.floor(rand(2, 9));
        let t = now + rand(0, .1);
        for (let i = 0; i < n; i++) { snap(t, false); t += rand(.01, .07); }
      }
      if (Math.random() < .06) snap(now + rand(0, .2), true);
    };
  }

  // campana de iglesia: parciales inarmónicos con caída larga
  const BELL = [[.5, .5, 9], [1, .9, 7], [1.19, .45, 5], [1.5, .3, 4], [2, .55, 4.5], [2.52, .2, 3], [2.66, .25, 3], [3.01, .15, 2.4], [4.16, .12, 1.8], [5.43, .06, 1.2]];
  function strike(dest, t, f, vol) {
    const g = ctx.createGain(); g.gain.value = vol; g.connect(dest);
    BELL.forEach(([ratio, amp, dec]) => {
      const o = ctx.createOscillator(), a = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = f * ratio * (1 + (Math.random() - .5) * .002);
      a.gain.setValueAtTime(0, t);
      a.gain.linearRampToValueAtTime(amp, t + .006);
      a.gain.exponentialRampToValueAtTime(.0001, t + dec);
      o.connect(a).connect(g);
      o.start(t); o.stop(t + dec + .1);
    });
    // golpe del badajo
    const n = ctx.createBufferSource(); n.buffer = noiseBuffer('white', .1);
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * 4; bp.Q.value = 1.5;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(.35, t); ng.gain.exponentialRampToValueAtTime(.0001, t + .08);
    n.connect(bp).connect(ng).connect(g); n.start(t);
  }
  function buildBells() {
    const L = layer('bells');
    let next = 0;
    L.tick = (now) => {
      if (now < next) return;
      // campanadas lejanas: dos o tres golpes cada tanto
      const f = [196, 220, 174.6][Math.floor(Math.random() * 3)];
      const n = 2 + Math.floor(Math.random() * 2);
      for (let i = 0; i < n; i++) strike(L.out, now + .1 + i * 2.1, f, .22);
      next = now + rand(16, 28);
    };
  }
  let bellOut = null;

  // cuerda pulsada para el índice (Karplus-Strong)
  const plucks = {};
  function pluckBuffer(freq) {
    const key = Math.round(freq);
    if (plucks[key]) return plucks[key];
    const sr = ctx.sampleRate, len = Math.floor(sr * 2);
    const buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
    const N = Math.max(2, Math.round(sr / freq));
    for (let i = 0; i < N; i++) d[i] = (Math.random() * 2 - 1) * .5;
    for (let i = N; i < len; i++) d[i] = .4985 * (d[i - N] + d[i - N + 1]);
    for (let i = 0; i < 64; i++) d[i] *= i / 64;
    return (plucks[key] = buf);
  }

  function init() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
    const pink = noiseBuffer('pink', 6), white = noiseBuffer('white', 3), brown = noiseBuffer('brown', 6);
    buildWind(pink, brown);
    buildBreeze(pink);
    buildFire(brown, white, pink);
    buildBells();
    bellOut = ctx.createGain();
    bellOut.gain.value = .9;
    bellOut.connect(comp);
    timer = setInterval(() => {
      if (!enabled) return;
      const now = ctx.currentTime;
      (SYNTH[current] || []).forEach(([n]) => { if (synth[n] && synth[n].tick) synth[n].tick(now); });
    }, 180);
  }

  function applySynth() {
    if (!ctx) return;
    const now = ctx.currentTime;
    const want = {};
    if (enabled) (SYNTH[current] || []).forEach(([n, v]) => { want[n] = v; });
    Object.entries(synth).forEach(([n, L]) => {
      L.out.gain.cancelScheduledValues(now);
      L.out.gain.setTargetAtTime(want[n] || 0, now, 1);
    });
    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(enabled ? .8 : 0, now, .4);
  }

  function apply() { applySynth(); applyTracks(); }
  function emit() { listeners.forEach((fn) => fn({ enabled, key: current, scene: SCENES[current] || '' })); }

  // desbloquea todas las pistas dentro del gesto del usuario (Safari/iOS)
  function unlock() {
    Object.values(tracks).forEach((t) => {
      const pr = t.el.play();
      if (pr && pr.then) pr.then(() => { if (t.target === 0) t.el.pause(); }).catch(() => {});
    });
  }

  return {
    enable() {
      init();
      if (ctx) ctx.resume();
      enabled = true;
      unlock();
      apply(); emit();
    },
    disable() { enabled = false; apply(); emit(); },
    toggle() { enabled ? this.disable() : this.enable(); return enabled; },
    setScene(name) {
      if (!name || name === current) return;
      current = name;
      apply(); emit();
    },
    tick(freq) {
      if (!enabled || !ctx) return;
      const s = ctx.createBufferSource();
      s.buffer = pluckBuffer(freq || 587.33);
      const g = ctx.createGain(); g.gain.value = .14;
      s.connect(g).connect(master);
      s.start();
    },
    // campana a pedido (suena aunque el ambiente esté apagado)
    bell() {
      init();
      if (!ctx) return;
      ctx.resume();
      const t = ctx.currentTime + .05;
      strike(bellOut, t, 220, .5);
      strike(bellOut, t + 2.2, 196, .42);
      strike(bellOut, t + 4.4, 220, .36);
    },
    isOn() { return enabled; },
    onChange(fn) { listeners.push(fn); }
  };
})();
