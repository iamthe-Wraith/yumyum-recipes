import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SENTRY_DSN, PUBLIC_APP_ENV } from '$env/static/public';
import type { HandleClientError } from '@sveltejs/kit';

Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,
  environment: PUBLIC_APP_ENV,
  tracesSampleRate: 1.0,
  // For instance, initialize Session Replay:
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [new Sentry.Replay()],
});

const errorHandler = (({ error, event }) => {
  console.error('An error occurred on the client side:', error, event);
}) satisfies HandleClientError;

export const handleError = Sentry.handleErrorWithSentry(errorHandler);
