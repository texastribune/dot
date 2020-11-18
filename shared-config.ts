/* eslint-disable prefer-destructuring */

export const APP_URL = process.env.APP_URL;
export const AUTH0_API_AUDIENCE = 'https://texastribune.org/dot';
export const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID || '';
export const AUTH0_DOMAIN =
  process.env.AUTH0_DOMAIN || 'auth-test.texastribune.org';
export const AUTH0_JWT_ISSUER = `https://${AUTH0_DOMAIN}/`;
export const AUTH0_PUBLIC_KEY_URL = `https://${AUTH0_DOMAIN}/.well-known/jwks.json`;
export const AUTH0_REDIRECT_URI = `${APP_URL}/dashboard/logged-in/`;
export const AUTH0_TOKEN_URL = `https://${AUTH0_DOMAIN}/oauth/token`;
export const ENABLE_SENTRY = process.env.ENABLE_SENTRY === 'true';
export const SENTRY_DSN = process.env.SENTRY_DSN;
export const SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT;
export const TIMEZONE = 'America/Chicago';
export const VUETIFY_NONCE = process.env.VUETIFY_NONCE || '';
