import { NavLink } from 'react-router'
import {
  AccountIcon,
  CapabilitiesIcon,
  CollapseSidebarIcon,
  DatabaseIcon,
  ExpandSidebarIcon,
  type IconComponent,
  NetworkingIcon,
  StorageIcon,
  UiComponentsIcon,
} from '../icons/catalog'
import { useTranslation } from '../../hooks'
import { Routes, type AppRoute } from '../../../utils'
import { Divider } from '../dividers'
import { IconButton } from '../IconButton'
import { Tooltip } from '../Tooltip'
import { VisuallyHidden } from '../VisuallyHidden'
import styles from './Sidebar.module.css'

interface NavItem {
  route: AppRoute
  titleKey: string
  Icon: IconComponent
}

const NAV_ITEMS: readonly NavItem[] = [
  { route: Routes.UI_COMPONENTS, titleKey: 'home.uiComponents.title', Icon: UiComponentsIcon },
  { route: Routes.NETWORKING, titleKey: 'home.networking.title', Icon: NetworkingIcon },
  { route: Routes.STORAGE, titleKey: 'home.storage.title', Icon: StorageIcon },
  { route: Routes.DATABASE, titleKey: 'home.database.title', Icon: DatabaseIcon },
  { route: Routes.CAPABILITIES, titleKey: 'home.capabilities.title', Icon: CapabilitiesIcon },
  { route: Routes.ACCOUNT, titleKey: 'home.account.title', Icon: AccountIcon },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { t } = useTranslation()

  return (
    <nav className={styles.sidebar} data-collapsed={collapsed || undefined}>
      <div className={styles.toolbar}>
        <IconButton
          size="small"
          onClick={onToggle}
          aria-expanded={!collapsed}
          aria-label={t(collapsed ? 'sidebar.expand' : 'sidebar.collapse')}
        >
          {collapsed ? <ExpandSidebarIcon aria-hidden /> : <CollapseSidebarIcon aria-hidden />}
        </IconButton>
      </div>
      <Divider />
      <ul className={styles.list}>
        {NAV_ITEMS.map(({ route, titleKey, Icon }) => (
          <li key={route}>
            <Tooltip title={collapsed && t(titleKey)} side="right">
              <NavLink to={route} className={styles.link}>
                <Icon className={styles.icon} aria-hidden />
                {collapsed ? <VisuallyHidden>{t(titleKey)}</VisuallyHidden> : <span>{t(titleKey)}</span>}
              </NavLink>
            </Tooltip>
          </li>
        ))}
      </ul>
    </nav>
  )
}
