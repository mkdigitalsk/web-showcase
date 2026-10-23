import { useState } from 'react'

/** The outcome of the last operation the person started, cleared as the next one starts, and whether one is running. */
export function useOutcome<Outcome>() {
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [pending, setPending] = useState(false)

  const run = async (operation: () => Promise<Outcome>) => {
    setOutcome(null)
    setPending(true)
    try {
      setOutcome(await operation())
    } finally {
      setPending(false)
    }
  }

  return { outcome, pending, run }
}
