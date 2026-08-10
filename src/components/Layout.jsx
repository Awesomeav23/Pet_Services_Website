import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import SkipLink from './SkipLink.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import styles from './Layout.module.css';

/**
 * Shown while a lazily loaded route chunk arrives.
 *
 * role="status" announces the wait rather than leaving screen-reader users on
 * a silently blank page.
 */
function RouteFallback() {
  return (
    <div className="section container" role="status">
      <p>Loading…</p>
    </div>
  );
}

/**
 * Page shell shared by every route.
 *
 * The HTML5 landmarks here (header / nav / main / footer) are what let screen
 * reader users jump straight to a region instead of reading linearly.
 *
 * #main-content carries tabIndex={-1} so ScrollToTop can move focus here after
 * a navigation without adding <main> to the tab order.
 *
 * The Suspense boundary sits around the Outlet rather than around the whole
 * shell, so a route change swaps only the page content. Wrapping the shell
 * would unmount the header, footer and #main-content itself while the next
 * chunk loads, and focus would have nowhere to land.
 */
export default function Layout() {
  return (
    <div className={styles.shell}>
      <SkipLink />
      <Navbar />
      <main id="main-content" tabIndex={-1} className={styles.main}>
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
