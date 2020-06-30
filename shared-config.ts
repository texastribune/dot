import pkg from './package.json';

export const { version: VERSION } = pkg;
export const { APP_URL } = process.env;
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';
export const PORT = parseInt(process.env.NODE_PORT || '3000', 10);

export const ACCESS_IDS = JSON.parse(process.env.ACCESS_IDS || '{}') as {
  [key: string]: string;
};

export const {
  AUTH0_DOMAIN = 'auth-test.texastribune.org',
  AUTH0_CLIENT_ID = '',
  AUTH0_CLIENT_SECRET = '',
} = process.env;
export const AUTH0_API_AUDIENCE = 'https://texastribune.org/dot';
export const AUTH0_JWT_ISSUER = `https://${AUTH0_DOMAIN}/`;
export const AUTH0_PUBLIC_KEY_URL = `https://${AUTH0_DOMAIN}/.well-known/jwks.json`;
export const AUTH0_REDIRECT_URI = `${APP_URL}/logged-in/`;
export const AUTH0_TOKEN_URL = `https://${AUTH0_DOMAIN}/oauth/token`;

export const { SENTRY_DSN, SENTRY_ENVIRONMENT } = process.env;
export const ENABLE_SENTRY = process.env.ENABLE_SENTRY === 'true';
