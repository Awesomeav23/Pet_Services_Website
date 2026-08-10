import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Client-side routing keeps the scroll position between pages, which strands
 * users part-way down a new page. Reset it on every navigation, and move focus
 * to the main landmark so keyboard and screen-reader users start at the top of
 * the new content instead of wherever the old page left them.
 *
 * The first render is deliberately exempt from the focus move. Focusing <main>
 * on initial load puts the caret past the header, which makes the skip link
 * unreachable by Tab and leaves the navigation behind the user — the opposite
 * of what the skip link is for. On a fresh load the browser already starts at
 * the top of the document, so there is nothing to correct.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const main = document.getElementById('main-content');
    if (main) main.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
