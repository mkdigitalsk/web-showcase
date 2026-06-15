import { type ReactNode } from 'react'
import { type SxProps, type TypographyProps } from '@mui/material'

export interface SpacingSx {
  mt?: string | number
  mb?: string | number
  ml?: string | number
  mr?: string | number
  mx?: string | number
  my?: string | number
  pt?: string | number
  pb?: string | number
  pl?: string | number
  pr?: string | number
  px?: string | number
  py?: string | number
}

export interface BaseTextProps {
  sx?: SpacingSx
  align?: TypographyProps['align']
  gutterBottom?: boolean
  noWrap?: boolean
  children?: ReactNode
}

export interface TextInternalProps extends BaseTextProps {
  internalSx?: SxProps
}
