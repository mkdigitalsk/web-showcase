import type { SxProps, Theme } from '@mui/material/styles'

/**
 * Auto margins rather than justifyContent: centred content that outgrows the viewport overflows equally
 * at both ends under `center`, and the top is then unreachable by scrolling. Auto margins collapse to
 * zero instead, so a short screen scrolls to the title.
 */
export const centredColumnSx: SxProps<Theme> = { my: 'auto', py: 4, display: 'flex', flexDirection: 'column' }
