import { PUBLIC_APP_ENV } from '$env/static/public';

export const getDenyUrls = () => {
  return [/status/gi];
};

export const getTracesSampleRate = () => {
  if (PUBLIC_APP_ENV === 'production') return 0.2;
  if (PUBLIC_APP_ENV === 'test') return 0;
  return 1.0;
};
