import { useEffect, useRef, useState } from 'react'

/**
 * Reads text aloud through the Web Speech API, one utterance at a time. The voice is the window's and reads on past
 * the page, so leaving the page mid-utterance silences it.
 */
export function useSpeech() {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [isSpeaking, setIsSpeaking] = useState(false)
  const current = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (!isSupported) return
    return () => {
      if (current.current) window.speechSynthesis.cancel()
    }
  }, [isSupported])

  /**
   * A stopped utterance settles late, after the next has started, so only the current one is settled. One that fails
   * fires `error` and never `end`, so either settles it.
   * [Web Speech API — the error event](https://webaudio.github.io/web-speech-api/#eventdef-speechsynthesisutterance-error)
   */
  const settle = (spoken: SpeechSynthesisUtterance) => {
    if (current.current !== spoken) return
    current.current = null
    setIsSpeaking(false)
  }

  const toggle = (text: string) => {
    if (!isSupported) return
    if (current.current) {
      current.current = null
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    const spoken = new SpeechSynthesisUtterance(text)
    spoken.onend = () => settle(spoken)
    spoken.onerror = () => settle(spoken)
    current.current = spoken
    setIsSpeaking(true)
    window.speechSynthesis.speak(spoken)
  }

  return { isSupported, isSpeaking, toggle }
}
