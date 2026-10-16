"use client"

let audioInstance: HTMLAudioElement | null = null
let isPlaying = false

const STREAM_URL = "https://stream.zeno.fm/0r0xa792kwzuv"

export function isRadioPlaying() {
  return isPlaying
}

export function toggleRadio(onStateChange?: (playing: boolean) => void): {
  promise: Promise<boolean>
  action: "play" | "pause"
} {
  if (typeof window === "undefined") {
    return { promise: Promise.resolve(false), action: "pause" }
  }

  if (!audioInstance) {
    audioInstance = new Audio(STREAM_URL)
    audioInstance.volume = 0.35
    audioInstance.crossOrigin = "anonymous"
  }

  if (isPlaying) {
    audioInstance.pause()
    isPlaying = false
    onStateChange?.(false)
    return { promise: Promise.resolve(false), action: "pause" }
  }

  const playPromise = audioInstance
    .play()
    .then(() => {
      isPlaying = true
      onStateChange?.(true)
      return true
    })
    .catch((err) => {
      console.warn("Audio autoplay blocked or stream error:", err)
      isPlaying = false
      onStateChange?.(false)
      return false
    })

  return { promise: playPromise, action: "play" }
}

export function stopRadio() {
  if (audioInstance && isPlaying) {
    audioInstance.pause()
    isPlaying = false
  }
}
