import { Box, Toolbar } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { AccountMenu } from './AccountMenu'
import { Sidebar } from './Sidebar'

export function AppLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <AccountMenu />
        </Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
