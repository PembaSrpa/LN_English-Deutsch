'use client'

export type NarrationLang = 'de-DE' | 'en-GB'

let cachedSupported: boolean | null = null

export async function isTtsSupported(): Promise<boolean> {
  if (cachedSupported !== null) return cachedSupported
  try {
    const { Capacitor } = await import('@capacitor/core')
    if (Capacitor.isNativePlatform()) {
      cachedSupported = true
      return true
    }
  } catch {
    cachedSupported = false
    return false
  }
  cachedSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
  return cachedSupported
}

export async function speak(text: string, lang: NarrationLang): Promise<void> {
  if (!text.trim()) return
  try {
    const { TextToSpeech } = await import('@capacitor-community/text-to-speech')
    await TextToSpeech.speak({ text, lang, rate: 1.0, pitch: 1.0, volume: 1.0, category: 'ambient' })
  } catch {
    return
  }
}

export async function stopSpeaking(): Promise<void> {
  try {
    const { TextToSpeech } = await import('@capacitor-community/text-to-speech')
    await TextToSpeech.stop()
  } catch {
    return
  }
}
