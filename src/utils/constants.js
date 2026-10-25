import Config from 'react-native-config';

// Set per build in .env.development / .env.production (see .env.example).
export const BASE_URL = (Config.APP_BASE_URL ?? '').replace(/\/?$/, '/');

if (__DEV__ && !Config.APP_BASE_URL) {
  console.warn(
    'APP_BASE_URL is missing from the .env file used for this build.',
  );
}
