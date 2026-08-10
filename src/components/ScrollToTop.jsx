import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Client-side routing keeps the scroll position between pages, which strands
 * users part-way down a new page. Reset it on every navigation, and move focus
 * to the main landmark so keyboard and screen-reader users start at the top of
 * the new content instead of wherever the old page left them.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const main = document.getElementById('main-content');
    if (main) main.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
