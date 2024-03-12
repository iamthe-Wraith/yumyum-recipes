import { sequence } from '@sveltejs/kit/hooks';
import { handleErrorWithSentry, sentryHandle } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_APP_ENV } from '$env/static/public';
import { authenticate } from './hooks/authenticate';
import { getDenyUrls } from '$lib/helpers/sentry';

Sentry.init({
  dsn: 'https://abf070318ffdf029d9a8f61969dae458@o4505018196295680.ingest.sentry.io/4505702958759936',
  environment: PUBLIC_APP_ENV,
  tracesSampleRate: 1.0,
  // ignore the following urls
  // https://docs.sentry.io/platforms/javascript/guides/sveltekit/configuration/filtering/
  denyUrls: getDenyUrls(),
});

// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(sentryHandle(), authenticate);

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
