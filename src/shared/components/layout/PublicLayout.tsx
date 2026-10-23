import { Outlet } from 'react-router'
import { Footer } from './Footer'
import { TopBar } from './TopBar'
import styles from './PublicLayout.module.css'

/**
 * The footer rides along because the privacy notice has to be reachable from the form that collects
 * the data, and AppLayout sits behind the session guard.
 */
export default function PublicLayout() {
  return (
    <div className={styles.shell}>
      <TopBar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
