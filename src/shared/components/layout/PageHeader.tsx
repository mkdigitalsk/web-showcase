import { Box } from '@mui/material'
import { visuallyHidden } from '@mui/utils'
import { TextBody1Neutral60 } from '../text'

interface PageHeaderProps {
  title: string
  description: string
}

// The nav already names the screen and marks which one is open, so drawing the name again is noise.
// It stays in the tree as the page's one h1 because the nav is a set of links, not a heading, and a
// page with no heading leaves a screen reader nothing to announce it by.
export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box component="h1" sx={visuallyHidden}>
        {title}
      </Box>
      <TextBody1Neutral60>{description}</TextBody1Neutral60>
    </Box>
  )
}
