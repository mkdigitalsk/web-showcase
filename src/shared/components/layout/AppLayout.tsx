import { useState } from 'react'
import { Outlet, useNavigation } from 'react-router'
import { Group, Panel, Separator, useDefaultLayout, usePanelRef, type PanelSize } from 'react-resizable-panels'
import { ConsentBar } from '../../analytics/ConsentBar'
import { useTranslation } from '../../hooks'
import { LinearProgress } from '../feedback'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import styles from './AppLayout.module.css'

/** The sidebar's narrowest open width, in percent of the shell; anything narrower is its collapsed rail. */
const SIDEBAR_MIN_SIZE = 12

/**
 * The signed-in shell. A navigation waits for the next page's loaders, so a bar across the top of the page says
 * one is under way. The consent bar is the shell's last row, so the panels give up its height and the page never
 * outgrows the window.
 */
export default function AppLayout() {
  const { t } = useTranslation()
  const isNavigating = useNavigation().state === 'loading'
  const sidebarRef = usePanelRef()
  const [collapsed, setCollapsed] = useState(false)
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({ id: 'app-layout' })

  const toggleSidebar = () => {
    const panel = sidebarRef.current
    if (!panel) return
    if (panel.isCollapsed()) panel.expand()
    else panel.collapse()
  }

  return (
    <div className={styles.shell}>
      <TopBar />

      <Group
        orientation="horizontal"
        defaultLayout={defaultLayout}
        onLayoutChanged={onLayoutChanged}
        className={styles.panels}
      >
        <Panel
          id="sidebar"
          panelRef={sidebarRef}
          collapsible
          collapsedSize="5%"
          minSize={`${SIDEBAR_MIN_SIZE}%`}
          maxSize="28%"
          defaultSize="18%"
          onResize={(size: PanelSize) => setCollapsed(size.asPercentage < SIDEBAR_MIN_SIZE)}
        >
          <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
        </Panel>

        <Separator className={styles.handle} />

        <Panel id="main">
          <main className={styles.main}>
            {isNavigating && <LinearProgress aria-label={t('common.loading')} className={styles.progress} />}
            <div className={styles.scroll}>
              <Outlet />
            </div>
          </main>
        </Panel>
      </Group>

      <Footer />
      <ConsentBar />
    </div>
  )
}
