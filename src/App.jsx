import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';
import Placeholder from './pages/Placeholder.jsx';
import NotFound from './pages/NotFound.jsx';

/**
 * Route table for the site.
 *
 * The four Placeholder routes below keep every navigation destination
 * reachable while the remaining sections are built; each is swapped for its
 * real page as that section lands. Anything unmatched falls through to
 * NotFound.
 */
export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/services"
            element={
              <Placeholder
                title="Services"
                description="Our seven service categories, with pricing and filters, are being added next."
              />
            }
          />
          <Route
            path="/booking"
            element={
              <Placeholder
                title="Book a Visit"
                description="The appointment request form is on its way."
              />
            }
          />
          <Route
            path="/about"
            element={
              <Placeholder
                title="About"
                description="Meet the team and read what local owners say about us."
              />
            }
          />
          <Route
            path="/contact"
            element={
              <Placeholder
                title="Contact"
                description="Opening hours, directions and a message form are coming shortly."
              />
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
