type ButtonVariant = 'primary' | 'secondary' | 'outline'

interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-neutral-0 hover:opacity-90',
  secondary: 'bg-secondary text-neutral-100 hover:opacity-90',
  outline: 'border border-primary text-primary hover:bg-primary hover:text-neutral-0',
}

export function Button({
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        px-4 py-2 rounded font-medium transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
