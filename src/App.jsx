import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Home from './pages/Home.jsx';

/**
 * Route table for the site.
 *
 * Home is imported eagerly since it is the usual entry point. The rest are
 * split into their own chunks so a first-time visitor downloads the booking
 * form and the About content only if they actually go there.
 */
const Services = lazy(() => import('./pages/Services.jsx'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail.jsx'));
const Booking = lazy(() => import('./pages/Booking.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

/**
 * Shown while a route chunk loads.
 *
 * role="status" announces the wait instead of leaving screen-reader users on a
 * silent blank page.
 */
function RouteFallback() {
  return (
    <div className="section container" role="status">
      <p>Loading…</p>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
