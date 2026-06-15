import { useState } from 'react'

export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    sessionStorage.setItem(key, JSON.stringify(valueToStore))
  }

  const removeValue = () => {
    setStoredValue(initialValue)
    sessionStorage.removeItem(key)
  }

  return [storedValue, setValue, removeValue] as const
}
