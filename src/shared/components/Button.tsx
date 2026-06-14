import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material'

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline'
  loading?: boolean
}

const variantMap = {
  primary: { variant: 'contained', color: 'primary' },
  secondary: { variant: 'contained', color: 'secondary' },
  outline: { variant: 'outlined', color: 'primary' },
} as const

export function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const muiVariant = variantMap[variant]

  return (
    <MuiButton
      variant={muiVariant.variant}
      color={muiVariant.color}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </MuiButton>
  )
}
