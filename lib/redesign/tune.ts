let ctx: AudioContext | null = null
let timer = 0
let playing = false

function chord(context: AudioContext, when: number) {
  const master = context.createGain()
  master.gain.value = 0.045
  master.connect(context.destination)
  ;[196, 247, 294, 392].forEach((freq, index) => {
    const osc = context.createOscillator()
    const gain = context.createGain()
    osc.type = index % 2 === 0 ? "sine" : "triangle"
    osc.frequency.value = freq
    const start = when + index * 0.12
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.22, start + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.7)
    osc.connect(gain)
    gain.connect(master)
    osc.start(start)
    osc.stop(start + 0.75)
  })
}

export function isTuneOn() {
  return playing
}

export async function toggleTune() {
  const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return false
  if (playing) {
    playing = false
    window.clearInterval(timer)
    timer = 0
    await ctx?.suspend()
    return false
  }
  ctx = ctx ?? new Ctx()
  await ctx.resume()
  playing = true
  chord(ctx, ctx.currentTime)
  timer = window.setInterval(() => {
    if (ctx && playing) chord(ctx, ctx.currentTime)
  }, 1600)
  return true
}

export async function playBassRiff() {
  const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return
  ctx = ctx ?? new Ctx()
  await ctx.resume()
  const filter = ctx.createBiquadFilter()
  filter.type = "lowpass"
  filter.frequency.value = 240
  const master = ctx.createGain()
  master.gain.value = 0.55
  filter.connect(master)
  master.connect(ctx.destination)
  const notes = [
    { f: 41.2, t: 0, d: 0.2 },
    { f: 41.2, t: 0.24, d: 0.12 },
    { f: 55, t: 0.42, d: 0.22 },
    { f: 49, t: 0.7, d: 0.16 },
    { f: 41.2, t: 0.92, d: 0.22 },
    { f: 36.7, t: 1.2, d: 0.18 },
    { f: 32.7, t: 1.44, d: 0.42 },
  ]
  for (const note of notes) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sawtooth"
    osc.frequency.setValueAtTime(note.f, ctx.currentTime + note.t)
    const start = ctx.currentTime + note.t
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.85, start + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + note.d)
    osc.connect(gain)
    gain.connect(filter)
    osc.start(start)
    osc.stop(start + note.d + 0.02)
  }
}

export function stopTune() {
  playing = false
  window.clearInterval(timer)
  timer = 0
  void ctx?.suspend()
}
