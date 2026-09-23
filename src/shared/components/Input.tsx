import { useState } from 'react'
import { TextField, InputAdornment, IconButton, type TextFieldProps } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useTranslation } from '../hooks'

type InputProps = TextFieldProps

/**
 * The label names what the press will do and flips with the state, so a screen reader hears the outcome
 * rather than "button". The glyph is hidden from the tree or it gets announced a second time under its
 * own name.
 */
function PasswordVisibilityToggle({ visible, onToggle }: { visible: boolean; onToggle: () => void }) {
  const { t } = useTranslation()

  return (
    <IconButton onClick={onToggle} edge="end" aria-label={t(visible ? 'input.hidePassword' : 'input.showPassword')}>
      {visible ? <VisibilityOff aria-hidden /> : <Visibility aria-hidden />}
    </IconButton>
  )
}

export function Input({ type = 'text', ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <TextField
      type={inputType}
      slotProps={
        isPassword
          ? {
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <PasswordVisibilityToggle visible={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                  </InputAdornment>
                ),
              },
            }
          : undefined
      }
      {...props}
    />
  )
}
