/**
 * The serverless entry point.
 *
 * Vercel treats each file under /api as a function; this one hands it the same
 * Express application that `server/src/index.js` listens with locally. Nothing
 * about the routes, the validation or the database access differs between the
 * two — the only difference is who calls listen().
 *
 * Deploying the site and the API from one project means they share an origin,
 * so the CORS configuration in the app is only ever exercised in development.
 *
 * The import is dynamic and guarded rather than a re-export. The app reads its
 * configuration and opens a pool at import time, so anything missing throws
 * before a handler exists, and a serverless runtime can then only report
 * FUNCTION_INVOCATION_FAILED with the reason buried in a dashboard. Catching it
 * here turns the same failure into a JSON 503 that names the cause, so a single
 * curl diagnoses the deployment.
 */

/** Cached across invocations on a warm function, so config is read once. */
let appPromise = null;

/** Connection strings carry credentials and can surface in driver errors. */
const redact = (text) => String(text).replace(/\/\/[^/@\s]*:[^/@\s]*@/g, '//***:***@');

export default async function handler(request, response) {
  try {
    appPromise ??= import('../server/src/app.js').then((m) => m.createApp());
    const app = await appPromise;
    return app(request, response);
  } catch (error) {
    // Not cached: a variable added in the dashboard should take effect on the
    // next request rather than needing a redeploy.
    appPromise = null;

    const code = error?.code === 'ERR_MODULE_NOT_FOUND'
      ? 'server_build_missing'
      : 'server_misconfigured';

    response.statusCode = 503;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({ error: redact(error?.message ?? error), code }));
  }
}
