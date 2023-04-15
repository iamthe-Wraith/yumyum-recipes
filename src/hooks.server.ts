import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SENTRY_DSN } from '$env/static/public';
import type { HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { authenticate } from './hooks/authenticate';

Sentry.init({
  dsn: PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});

import { handleErrorWithSentry } from '@sentry/sveltekit';

const myErrorHandler = (({ error, event }) => {
  console.error('An error occurred on the server side:', error, event);
}) satisfies HandleServerError;

export const handleError = handleErrorWithSentry(myErrorHandler);
export const handle = sequence(Sentry.sentryHandle, authenticate);