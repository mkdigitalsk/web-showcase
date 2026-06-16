/**
 * Returns the context value or throws if it is missing — the React equivalent of
 * Kotlin's `requireNotNull`. Call it inside a context hook so the value is
 * guaranteed non-null and a forgotten Provider fails loudly with a clear message.
 *
 * @example
 * export function useAuth() {
 *   return requireContext(useContext(AuthContext), 'useAuth')
 * }
 */
export function requireContext<T>(value: T | null | undefined, hookName: string): T {
  if (value == null) {
    throw new Error(`${hookName} must be used within its matching Provider`)
  }
  return value
}
