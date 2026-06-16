import {
  CalendarMonth,
  Cloud,
  Dataset,
  Extension,
  Home as HomeIcon,
  Menu as MenuIcon,
  MenuOpen,
  Palette,
  Storage as StorageIcon,
} from '@mui/icons-material'
import { Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Tooltip } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLocalStorage, useTranslation } from '../../hooks'
import { Routes } from '../../../utils'
import { Divider } from '../dividers'
import { TextH6BoldPrimary } from '../text'

const EXPANDED_WIDTH = 240
const COLLAPSED_WIDTH = 72

const navItems = [
  { route: Routes.HOME, titleKey: 'home.title', Icon: HomeIcon },
  { route: Routes.UI_COMPONENTS, titleKey: 'home.uiComponents.title', Icon: Palette },
  { route: Routes.NETWORKING, titleKey: 'home.networking.title', Icon: Cloud },
  { route: Routes.STORAGE, titleKey: 'home.storage.title', Icon: StorageIcon },
  { route: Routes.DATABASE, titleKey: 'home.database.title', Icon: Dataset },
  { route: Routes.CAPABILITIES, titleKey: 'home.capabilities.title', Icon: Extension },
  { route: '/calendar', titleKey: 'home.calendar.title', Icon: CalendarMonth },
] as const

export function Sidebar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useLocalStorage('sidebar.collapsed', false)

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        flexShrink: 0,
        transition: (theme) => theme.transitions.create('width'),
        '& .MuiDrawer-paper': {
          width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
          overflowX: 'hidden',
          boxSizing: 'border-box',
          transition: (theme) => theme.transitions.create('width'),
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: collapsed ? 'center' : 'space-between', px: 2 }}>
        {!collapsed && <TextH6BoldPrimary noWrap>{t('app.name')}</TextH6BoldPrimary>}
        <IconButton onClick={() => setCollapsed((c) => !c)} size="small">
          {collapsed ? <MenuIcon /> : <MenuOpen />}
        </IconButton>
      </Toolbar>

      <Divider />

      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.route
          return (
            <Tooltip key={item.route} title={collapsed ? t(item.titleKey) : ''} placement="right">
              <ListItemButton
                selected={isActive}
                onClick={() => navigate(item.route)}
                sx={{ justifyContent: collapsed ? 'center' : 'flex-start', px: collapsed ? 0 : 2 }}
              >
                <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
                  <item.Icon color={isActive ? 'primary' : 'inherit'} />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={t(item.titleKey)}
                    slotProps={{ primary: { color: isActive ? 'primary' : undefined } }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          )
        })}
      </List>
    </Drawer>
  )
}
