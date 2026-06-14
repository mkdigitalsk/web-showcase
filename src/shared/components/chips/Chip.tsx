import { Chip as MuiChip, type ChipProps as MuiChipProps } from '@mui/material'

type ChipProps = MuiChipProps

export function Chip({ sx, ...props }: ChipProps) {
  return <MuiChip sx={sx} {...props} />
}

type FilterChipProps = Omit<MuiChipProps, 'variant' | 'color'> & {
  selected: boolean
}

export function FilterChip({ selected, sx, ...props }: FilterChipProps) {
  return (
    <MuiChip
      variant={selected ? 'filled' : 'outlined'}
      color={selected ? 'primary' : 'default'}
      sx={sx}
      {...props}
    />
  )
}
