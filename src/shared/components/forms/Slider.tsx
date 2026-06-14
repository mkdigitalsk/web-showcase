import { Slider as MuiSlider, type SliderProps as MuiSliderProps } from '@mui/material'

type SliderProps = MuiSliderProps

export function Slider({ sx, ...props }: SliderProps) {
  return <MuiSlider color="primary" sx={sx} {...props} />
}
