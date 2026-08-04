import { GitHub } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from '../../hooks'
import { Logo } from '../icons/Logo'
import { TextCaption } from '../text'

const GITHUB = 'https://github.com/mkdigitalsk'

// Slim brand footer on the same navy surface as the top bar — closes the shell and carries the one
// piece of app-level meta a dashboard needs visible: company + version (bug-report reference).
export function Footer() {
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <Box
      component="footer"
      sx={{
        flexShrink: 0,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: { xs: 2, md: 3 },
        py: 2,
        bgcolor: theme.palette.brandBar,
        color: theme.palette.onBrandBar,
        borderTop: '1px solid',
        borderColor: 'divider',
        '& .MuiIconButton-root': { color: theme.palette.onBrandBar },
      }}
    >
      <Logo variant="lockup" height={26} onDark />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 2, rowGap: 0.5 }}>
        <TextCaption>© 2026 MK Digital s. r. o.</TextCaption>
        <TextCaption>{t('app.version', { version: __APP_VERSION__ })}</TextCaption>
        <IconButton
          component="a"
          href={GITHUB}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          size="small"
        >
          <GitHub fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  )
}
