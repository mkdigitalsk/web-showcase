import { DarkMode, LightMode } from '@mui/icons-material'
import { Box, IconButton, Tooltip } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { useAuth, useTranslation } from '../../hooks'
import type { ThemeMode } from '../../types'

const ICON_SIZE = 20

/** Toggling off an explicit mode restores 'system' — nothing else in the UI can get back to it. */
function toggledMode(mode: ThemeMode, systemMode: 'light' | 'dark' | undefined): ThemeMode {
  const opposite = systemMode === 'dark' ? 'light' : 'dark'
  return mode === 'system' ? opposite : 'system'
}

export function ThemeModeToggle() {
  const { t } = useTranslation()
  const { updateThemeMode } = useAuth()
  const { mode = 'system', systemMode } = useColorScheme()

  const resolved = mode === 'system' ? systemMode : mode
  const isDark = resolved === 'dark'

  const handleToggle = () => void updateThemeMode(toggledMode(mode, systemMode))

  const iconSx = {
    position: 'absolute',
    inset: 0,
    fontSize: ICON_SIZE,
    transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
  }

  return (
    <Tooltip title={t('home.theme', { mode: t(`home.theme.${mode}`) })}>
      <IconButton onClick={handleToggle} size="small" aria-label={t('home.theme.toggle')}>
        <Box sx={{ position: 'relative', width: ICON_SIZE, height: ICON_SIZE }}>
          <LightMode
            aria-hidden
            sx={{
              ...iconSx,
              opacity: isDark ? 0 : 1,
              transform: isDark ? 'rotate(90deg) scale(0.3)' : 'rotate(0deg) scale(1)',
            }}
          />
          <DarkMode
            aria-hidden
            sx={{
              ...iconSx,
              opacity: isDark ? 1 : 0,
              transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.3)',
            }}
          />
        </Box>
      </IconButton>
    </Tooltip>
  )
}
