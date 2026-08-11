import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from '../../hooks'
import { Logo } from '../icons/Logo'
import { TextBody1 } from '../text'
import { AccountMenu } from './AccountMenu'
import { LocaleSwitcher } from './LocaleSwitcher'
import { ThemeModeToggle } from './ThemeModeToggle'

// Full-bleed navy brand bar (Jira/Confluence app-shell): product identity + global actions on top,
// neutral contextual sidebar below. brandBar/onBrandBar are the shared design-system tokens, so the
// bar is navy in light and tonally-elevated (#2D343B) in dark automatically.
export function TopBar() {
  const theme = useTheme()
  const { t } = useTranslation()

  return (
    <Box
      component="header"
      sx={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 3 },
        py: 1,
        bgcolor: theme.palette.brandBar,
        color: theme.palette.onBrandBar,
        borderBottom: '1px solid',
        borderColor: 'divider',
        // Actions render on the navy surface → force their icons to the on-brand colour.
        '& .MuiIconButton-root': { color: theme.palette.onBrandBar },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Logo variant="lockup" height={32} onDark />
        {/* Product label (left, not centered) — disambiguates which app in the suite; the logo carries brand. */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ height: 22, width: '1px', bgcolor: theme.palette.onBrandBar, opacity: 0.3 }} />
          <Box sx={{ opacity: 0.85 }}>
            <TextBody1>{t('app.name')}</TextBody1>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LocaleSwitcher />
        <ThemeModeToggle />
        <AccountMenu />
      </Box>
    </Box>
  )
}
