import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  maxWidth?: number
  sx?: SxProps<Theme>
}

// Feature pages render into the wide app-shell panel. Cap the content measure so forms, cards and
// lists stay readable instead of stretching edge-to-edge (per-context width, not full-bleed).
// Left-aligned (hugs the sidebar) with responsive padding; override maxWidth for wider surfaces.
export function PageContainer({ children, maxWidth = 960, sx }: PageContainerProps) {
  return <Box sx={{ p: { xs: 2, md: 3 }, maxWidth, ...sx }}>{children}</Box>
}
