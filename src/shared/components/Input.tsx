import { useState, type ComponentProps } from 'react'
import { Input as BaseInput } from '@base-ui/react/input'
import { HideIcon, ShowIcon } from './icons/catalog'
import { useTranslation } from '../hooks'
import { FieldFrame, type FieldFrameProps } from './fields/FieldFrame'
import { IconButton } from './IconButton'

interface InputProps extends FieldFrameProps, Omit<ComponentProps<'input'>, 'size' | 'type' | 'className'> {
  type?: 'text' | 'password' | 'email' | 'date' | 'number' | 'url' | 'tel' | 'search'
}

/**
 * The label names what the press will do and flips with the state, so a screen reader hears the outcome
 * rather than "button". The glyph is hidden from the tree or it gets announced a second time under its
 * own name.
 */
function PasswordVisibilityToggle({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  const { t } = useTranslation()

  return (
    <IconButton size="small" onClick={onToggle} aria-label={t(visible ? 'input.hidePassword' : 'input.showPassword')}>
      {visible ? <HideIcon aria-hidden /> : <ShowIcon aria-hidden />}
    </IconButton>
  )
}

/** One line of input — several lines are a `TextArea`. A password carries its own show-and-hide. */
export function Input({
  label,
  type = 'text',
  error,
  errorText,
  helperText,
  size,
  disabled,
  endAdornment,
  className,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const adornment = isPassword ? (
    <PasswordVisibilityToggle visible={showPassword} onToggle={() => setShowPassword((shown) => !shown)} />
  ) : (
    endAdornment
  )

  return (
    <FieldFrame
      label={label}
      error={error}
      errorText={errorText}
      helperText={helperText}
      size={size}
      disabled={disabled}
      endAdornment={adornment}
      className={className}
    >
      <BaseInput type={isPassword && showPassword ? 'text' : type} {...props} />
    </FieldFrame>
  )
}
