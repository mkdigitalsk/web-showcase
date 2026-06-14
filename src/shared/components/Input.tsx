import { useState } from 'react'
import { TextField, InputAdornment, IconButton, type TextFieldProps } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

type InputProps = TextFieldProps

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
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
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
