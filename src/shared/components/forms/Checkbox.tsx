import { Checkbox as MuiCheckbox, type CheckboxProps as MuiCheckboxProps } from '@mui/material'

type CheckboxProps = MuiCheckboxProps

export function Checkbox({ sx, ...props }: CheckboxProps) {
  return <MuiCheckbox color="primary" sx={sx} {...props} />
}
