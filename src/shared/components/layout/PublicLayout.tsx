import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { Footer } from './Footer'
import { TopBar } from './TopBar'

// The footer rides along because the privacy notice has to be reachable from the form that collects
// the data, and AppLayout sits behind PrivateRoute.
export function PublicLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  )
}
