import {
  Cloud,
  Dataset,
  Extension,
  Home as HomeIcon,
  Menu as MenuIcon,
  MenuOpen,
  Palette,
  Storage as StorageIcon,
} from '@mui/icons-material'
import { Box, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Tooltip } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from '../../hooks'
import { Routes } from '../../../utils'
import { Divider } from '../dividers'
import { TextH6BoldPrimary } from '../text'

const navItems = [
  { route: Routes.HOME, titleKey: 'home.title', Icon: HomeIcon },
  { route: Routes.UI_COMPONENTS, titleKey: 'home.uiComponents.title', Icon: Palette },
  { route: Routes.NETWORKING, titleKey: 'home.networking.title', Icon: Cloud },
  { route: Routes.STORAGE, titleKey: 'home.storage.title', Icon: StorageIcon },
  { route: Routes.DATABASE, titleKey: 'home.database.title', Icon: Dataset },
  { route: Routes.CAPABILITIES, titleKey: 'home.capabilities.title', Icon: Extension },
] as const

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        overflowY: 'auto',
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: collapsed ? 'center' : 'space-between', px: 2 }}>
        {!collapsed && <TextH6BoldPrimary noWrap>{t('app.name')}</TextH6BoldPrimary>}
        <IconButton onClick={onToggle} size="small">
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
                    slotProps={{ primary: { color: isActive ? 'primary' : undefined, noWrap: true } }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          )
        })}
      </List>
    </Box>
  )
}
