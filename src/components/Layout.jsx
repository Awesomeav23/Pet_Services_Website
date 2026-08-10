import { Outlet } from 'react-router-dom';

import SkipLink from './SkipLink.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import styles from './Layout.module.css';

/**
 * Page shell shared by every route.
 *
 * The HTML5 landmarks here (header / nav / main / footer) are what let screen
 * reader users jump straight to a region instead of reading linearly.
 *
 * #main-content carries tabIndex={-1} so ScrollToTop can move focus here after
 * a navigation without adding <main> to the tab order.
 */
export default function Layout() {
  return (
    <div className={styles.shell}>
      <SkipLink />
      <Navbar />
      <main id="main-content" tabIndex={-1} className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
