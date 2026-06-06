let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  // Resume if suspended (browser autoplay policy)
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function playStart() {
  const c = getCtx();
  // Rising arpeggio: C5 → E5 → G5
  [523, 659, 784].forEach((freq, i) => {
    const osc  = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = "square";
    osc.frequency.value = freq;
    const t = c.currentTime + i * 0.09;
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.start(t);
    osc.stop(t + 0.28);
  });
}

export function playWhack() {
  const c = getCtx();
  // Short percussive noise burst
  const len    = Math.floor(c.sampleRate * 0.07);
  const buffer = c.createBuffer(1, len, c.sampleRate);
  const data   = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
  }
  const src  = c.createBufferSource();
  src.buffer = buffer;
  const gain = c.createGain();
  gain.gain.value = 0.7;
  src.connect(gain);
  gain.connect(c.destination);
  src.start();
}

export function playGameOver() {
  const c = getCtx();
  // Descending "wah-wah" fanfare
  [523, 440, 349, 262].forEach((freq, i) => {
    const osc  = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    const t = c.currentTime + i * 0.22;
    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.start(t);
    osc.stop(t + 0.28);
  });
}
