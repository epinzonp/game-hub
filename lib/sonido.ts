let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

function nota(c: AudioContext, frecu: number, inicio: number, duracion: number, vol = 0.18) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  const filtro = c.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.value = 900;
  osc.type = "triangle";
  osc.frequency.value = frecu;
  osc.connect(filtro);
  filtro.connect(gain);
  gain.connect(c.destination);

  const t0 = c.currentTime + inicio;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duracion);

  osc.start(t0);
  osc.stop(t0 + duracion + 0.05);
}

// Notas en Hz (tono menor). Melodía lenta y triste.
export function reproducirMelodiaTriste() {
  const ctx = getCtx();
  if (!ctx) return;

  // Acorde base menor: C, Eb (mi bemol), G
  const C4 = 261.63;
  const D4 = 293.66;
  const Eb4 = 311.13;
  const G4 = 392.0;
  const Bb4 = 466.16;

  // soplo grave de fondo (bajo)
  const bajo = ctx.createOscillator();
  const bajoGain = ctx.createGain();
  bajo.type = "triangle";
  bajo.frequency.value = 130.81; // C3
  bajoGain.gain.setValueAtTime(0.0001, ctx.currentTime);
  bajoGain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 0.2);
  bajoGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 8);
  bajo.connect(bajoGain).connect(ctx.destination);
  bajo.start(ctx.currentTime);
  bajo.stop(ctx.currentTime + 8.2);

  // Melodía por partes (descendente y pesarosa)
  const t = 0.9;
  nota(ctx, C4, t + 0.0, 1.6, 0.2);
  nota(ctx, Eb4, t + 1.6, 1.1, 0.2);
  nota(ctx, D4, t + 2.7, 1.1, 0.2);
  nota(ctx, C4, t + 3.8, 1.9, 0.2); // C4 es La-do menor; nota triste
  nota(ctx, Bb4 / 2, t + 5.7, 1.4, 0.16); // Bb3
  nota(ctx, G4 / 2, t + 7.1, 2.4, 0.16); // G3 final descendente

  // Un par de campanadas lejanas
  nota(ctx, C4 * 2, t + 6.0, 2.0, 0.05);
  nota(ctx, C4 * 2, t + 6.9, 2.4, 0.04);
}

export function reproducirSusto() {
  const ctx = getCtx();
  if (!ctx) return;

  const t0 = ctx.currentTime;
  const dur = 0.9;

  // Filtro pasa-alto para que suene agudo y agresivo
  const filtroAlto = ctx.createBiquadFilter();
  filtroAlto.type = "highpass";
  filtroAlto.frequency.value = 700;

  const master = ctx.createGain();
  master.gain.value = 0.9;
  filtroAlto.connect(master).connect(ctx.destination);

  // Vocal agonizante: dos osciladores disonantes que suben en glissando
  const barridos: { type: OscillatorType; desde: number; hasta: number; vol: number }[] = [
    { type: "sawtooth", desde: 400, hasta: 1500, vol: 0.5 },
    { type: "square", desde: 430, hasta: 1650, vol: 0.4 },
    { type: "sawtooth", desde: 900, hasta: 3200, vol: 0.25 },
  ];

  for (const b of barridos) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = b.type;
    osc.frequency.setValueAtTime(b.desde, t0);
    osc.frequency.exponentialRampToValueAtTime(b.hasta, t0 + 0.28);

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(b.vol, t0 + 0.05);
    g.gain.setValueAtTime(b.vol, t0 + 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(g).connect(filtroAlto);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // Ruido blanco corto (explosión)
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const nfiltro = ctx.createBiquadFilter();
  nfiltro.type = "bandpass";
  nfiltro.frequency.value = 1800;
  const ngain = ctx.createGain();
  ngain.gain.setValueAtTime(0.35, t0);
  ngain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.4);
  noise.connect(nfiltro).connect(ngain).connect(ctx.destination);
  noise.start(t0);
  noise.stop(t0 + 0.5);
}

export function reproducirVertidoAgua() {
  const ctx = getCtx();
  if (!ctx) return;

  const t0 = ctx.currentTime;
  const duracion = 0.6;

  const buffer = ctx.createBuffer(1, ctx.sampleRate * duracion, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1200, t0);
  filter.frequency.exponentialRampToValueAtTime(400, t0 + duracion);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(0.2, t0 + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duracion);

  noise.connect(filter).connect(gain).connect(ctx.destination);
  noise.start(t0);
  noise.stop(t0 + duracion);
}

export function reproducirVictoria() {
  const ctx = getCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime;
  
  const notas = [
    { f: 523.25, t: 0.0, d: 0.1 }, // C5
    { f: 659.25, t: 0.1, d: 0.1 }, // E5
    { f: 783.99, t: 0.2, d: 0.2 }, // G5
    { f: 1046.50, t: 0.4, d: 0.4 }, // C6
  ];

  notas.forEach(n => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(n.f, t0 + n.t);
    g.gain.setValueAtTime(0, t0 + n.t);
    g.gain.linearRampToValueAtTime(0.2, t0 + n.t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + n.t + n.d);
    osc.connect(g).connect(ctx.destination);
    osc.start(t0 + n.t);
    osc.stop(t0 + n.t + n.d + 0.05);
  });
}

export function reproducirRisa() {
  const ctx = getCtx();
  if (!ctx) return;

  const t0 = ctx.currentTime;
  
  const notas = [
    { f: 300, d: 0.1, t: 0.0 },
    { f: 300, d: 0.1, t: 0.2 },
    { f: 400, d: 0.1, t: 0.4 },
    { f: 400, d: 0.1, t: 0.6 },
    { f: 500, d: 0.1, t: 0.8 },
    { f: 500, d: 0.1, t: 1.0 },
  ];

    notas.forEach(n => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(n.f, t0 + n.t);
      
      g.gain.setValueAtTime(0, t0 + n.t);
      g.gain.linearRampToValueAtTime(0.1, t0 + n.t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + n.t + n.d);
      
      osc.connect(g).connect(ctx.destination);
      osc.start(t0 + n.t);
      osc.stop(t0 + n.t + n.d + 0.05);
    });
  }

  export function reproducirTicTac() {
    const ctx = getCtx();
    if (!ctx) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
    
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  export function reproducirFunkVictoria() {
    const ctx = getCtx();
    if (!ctx) return;
    const t0 = ctx.currentTime;

    // Bajo Funk (Sincopado)
    const bajo = ctx.createOscillator();
    const bajoGain = ctx.createGain();
    bajo.type = "square";
    bajo.frequency.setValueAtTime(55, t0); // A1
    bajoGain.gain.setValueAtTime(0, t0);
    
    // Ritmo funk simple (tump tump tss)
    const ritmo = [0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75];
    ritmo.forEach((time, i) => {
      if (i % 2 === 0) {
        bajoGain.gain.linearRampToValueAtTime(0.2, t0 + time + 0.01);
        bajoGain.gain.linearRampToValueAtTime(0, t0 + time + 0.1);
      }
    });

    bajo.connect(bajoGain).connect(ctx.destination);
    bajo.start(t0);
    bajo.stop(t0 + 2);

    // Melodía Funk brillante
    const notasFunk = [
      { f: 440, t: 0.1, d: 0.1 }, // A4
      { f: 523, t: 0.3, d: 0.1 }, // C5
      { f: 587, t: 0.5, d: 0.1 }, // D5
      { f: 659, t: 0.7, d: 0.2 }, // E5
    ];

    notasFunk.forEach(n => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(n.f, t0 + n.t);
      g.gain.setValueAtTime(0, t0 + n.t);
      g.gain.linearRampToValueAtTime(0.1, t0 + n.t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + n.t + n.d);
      osc.connect(g).connect(ctx.destination);
      osc.start(t0 + n.t);
      osc.stop(t0 + n.t + n.d + 0.05);
    });
  }

