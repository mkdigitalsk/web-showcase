interface InputProps {
  label: string
  type?: 'text' | 'email' | 'password'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  disabled?: boolean
  className?: string
}

export function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  className = '',
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium text-neutral-60">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          px-3 py-2 rounded border transition-colors
          focus:outline-none focus:ring-2 focus:ring-primary
          disabled:bg-neutral-20 disabled:cursor-not-allowed
          ${error ? 'border-error' : 'border-neutral-20'}
        `}
      />
      {error && (
        <span className="text-sm text-error">{error}</span>
      )}
    </div>
  )
}
