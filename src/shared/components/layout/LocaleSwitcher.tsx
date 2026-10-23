import { CheckIcon, LanguageIcon } from '../icons/catalog'
import { useAuth, useLocale, useTranslation } from '../../hooks'
import { IconButton } from '../IconButton'
import { Menu, MenuItem } from '../menus'
import styles from './LocaleSwitcher.module.css'

export function LocaleSwitcher() {
  const { t } = useTranslation()
  const { locale, locales } = useLocale()
  const { updateLocale } = useAuth()

  return (
    <Menu
      trigger={
        <IconButton size="small" aria-label={t('localeSwitcher.label')}>
          <LanguageIcon aria-hidden />
        </IconButton>
      }
    >
      {locales.map((option) => (
        <MenuItem key={option.code} selected={option.code === locale} onClick={() => void updateLocale(option.code)}>
          {option.label}
          {option.code === locale && <CheckIcon className={styles.check} aria-hidden />}
        </MenuItem>
      ))}
    </Menu>
  )
}
