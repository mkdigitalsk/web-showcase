import { useRef, useState } from 'react'
import { Outlet, useNavigation } from 'react-router'
import { Panel, PanelGroup, PanelResizeHandle, type ImperativePanelHandle } from 'react-resizable-panels'
import { useTranslation } from '../../hooks'
import { LinearProgress } from '../feedback'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import styles from './AppLayout.module.css'

/**
 * The signed-in shell. A navigation waits for the next page's loaders, so a bar across the top of the page says
 * one is under way.
 */
export default function AppLayout() {
  const { t } = useTranslation()
  const isNavigating = useNavigation().state === 'loading'
  const sidebarRef = useRef<ImperativePanelHandle>(null)
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    const panel = sidebarRef.current
    if (!panel) return
    if (panel.isCollapsed()) panel.expand()
    else panel.collapse()
  }

  return (
    <div className={styles.shell}>
      <TopBar />

      <PanelGroup direction="horizontal" autoSaveId="app-layout" className={styles.panels}>
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

        <PanelResizeHandle className={styles.handle} />

        <Panel id="main" order={2}>
          <main className={styles.main}>
            {isNavigating && <LinearProgress aria-label={t('common.loading')} className={styles.progress} />}
            <div className={styles.scroll}>
              <Outlet />
            </div>
          </main>
        </Panel>
      </PanelGroup>

      <Footer />
    </div>
  )
}
