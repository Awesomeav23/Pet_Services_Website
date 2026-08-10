import { useEffect } from 'react';

const SITE_NAME = 'Pawsome Pet Services';

/**
 * Keeps <title> in sync with the current route.
 *
 * In a single-page app the document title never changes on its own, which
 * leaves screen-reader users without a spoken confirmation that the page
 * changed, and makes browser history/tabs unreadable.
 */
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  }, [title]);
}
