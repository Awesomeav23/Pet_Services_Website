import compression from 'compression';
import cors from 'cors';
import express from 'express';

import { errorHandler } from './middleware/error-handler.js';
import { bookingsRouter } from './routes/bookings.js';
import { contactRouter } from './routes/contact.js';
import { servicesRouter } from './routes/services.js';

export const createApp = () => {
  const app = express();

  // gzip on JSON responses. The catalogue is repetitive text, which is
  // exactly what compresses well.
  app.use(compression());
  // Comma-separated so the Vite dev server and the preview build the e2e
  // suite runs against can both be allowed without redeploying.
  const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json({ limit: '16kb' }));

  app.get('/api/health', (request, response) => response.json({ status: 'ok' }));

  app.use('/api/services', servicesRouter);
  app.use('/api/bookings', bookingsRouter);
  app.use('/api/contact', contactRouter);

  app.use((request, response) => response.status(404).json({ error: 'Not found' }));
  app.use(errorHandler);

  return app;
};
