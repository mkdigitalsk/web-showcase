import { Radio as MuiRadio, type RadioProps as MuiRadioProps } from '@mui/material'

type RadioButtonProps = MuiRadioProps

export function RadioButton({ sx, ...props }: RadioButtonProps) {
  return <MuiRadio color="primary" sx={sx} {...props} />
}
