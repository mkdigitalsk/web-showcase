import { Box } from '@mui/material'
import { useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Panel, PanelGroup, PanelResizeHandle, type ImperativePanelHandle } from 'react-resizable-panels'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function AppLayout() {
  const sidebarRef = useRef<ImperativePanelHandle>(null)
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    const panel = sidebarRef.current
    if (!panel) return
    if (panel.isCollapsed()) panel.expand()
    else panel.collapse()
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />

      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <PanelGroup direction="horizontal" autoSaveId="app-layout" style={{ height: '100%' }}>
          <Panel
            id="sidebar"
            order={1}
            ref={sidebarRef}
            collapsible
            collapsedSize={5}
            minSize={12}
            maxSize={28}
            defaultSize={18}
            onCollapse={() => setCollapsed(true)}
            onExpand={() => setCollapsed(false)}
          >
            <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
          </Panel>

          <PanelResizeHandle style={{ width: 6, cursor: 'col-resize', outline: 'none' }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                '&:hover > div, &:active > div': { backgroundColor: 'primary.main', width: '2px' },
              }}
            >
              <Box
                sx={{
                  width: '1px',
                  height: '100%',
                  bgcolor: 'divider',
                  transition: 'background-color 0.15s ease, width 0.15s ease',
                }}
              />
            </Box>
          </PanelResizeHandle>

          <Panel id="main" order={2}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Outlet />
              </Box>
              <Footer />
            </Box>
          </Panel>
        </PanelGroup>
      </Box>
    </Box>
  )
}
