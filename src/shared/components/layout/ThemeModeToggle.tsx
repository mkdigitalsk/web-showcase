import { DarkSchemeIcon, LightSchemeIcon } from '../icons/catalog'
import { useAuth, useColorScheme, useTranslation } from '../../hooks'
import type { ThemeMode } from '../../types'
import { IconButton } from '../IconButton'
import { Tooltip } from '../Tooltip'
import styles from './ThemeModeToggle.module.css'

/** Toggling off an explicit mode restores 'system' — nothing else in the UI can get back to it. */
function toggledMode(mode: ThemeMode, systemMode: 'light' | 'dark' | undefined): ThemeMode {
  const opposite = systemMode === 'dark' ? 'light' : 'dark'
  return mode === 'system' ? opposite : 'system'
}

export function ThemeModeToggle() {
  const { t } = useTranslation()
  const { updateThemeMode } = useAuth()
  const { mode, systemMode, scheme } = useColorScheme()

  const handleToggle = () => void updateThemeMode(toggledMode(mode, systemMode))

  return (
    <Tooltip title={t('home.theme', { mode: t(`home.theme.${mode}`) })}>
      <IconButton onClick={handleToggle} size="small" aria-label={t('home.theme.toggle')}>
        <span className={styles.glyphs} data-dark={scheme === 'dark' || undefined} aria-hidden>
          <LightSchemeIcon className={styles.sun} />
          <DarkSchemeIcon className={styles.moon} />
        </span>
      </IconButton>
    </Tooltip>
  )
}
