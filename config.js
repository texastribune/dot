/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const pkg = require('./package.json');

const { version: VERSION } = pkg;
const { APP_URL } = process.env;
const IS_DEV = process.env.NODE_ENV === 'development';
const PORT = parseInt(process.env.NODE_PORT, 10);

const DASHBOARD_STATIC_ALIAS = '/static/';
const DASHBOARD_MANIFEST_FILE_NAME = 'assets.json';
const DASHBOARD_BUILD_PATH = path.join(process.cwd(), 'dist');
const DASHBOARD_MANIFEST_PATH = path.join(
  DASHBOARD_BUILD_PATH,
  DASHBOARD_MANIFEST_FILE_NAME
);

const PUBLIC_BUILD_PATH = path.join(process.cwd(), 'public');

const TRACKER_STATIC_ALIAS = '/analytics/';
const TRACKER_BUILD_PATH = path.join(process.cwd(), 'analytics');
const TRACKER_SCRIPT = 'dot.js';

const TEMPLATES_PATH = path.join(process.cwd(), 'server', 'views');

const { SENTRY_DSN, SENTRY_ENVIRONMENT } = process.env;
const ENABLE_SENTRY = process.env.ENABLE_SENTRY === 'true';

const {
  AUTH0_DOMAIN = 'auth-test.texastribune.org',
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_API_AUDIENCE = 'https://texastribune.org/dot',
} = process.env;
const AUTH0_JWT_ISSUER = `https://${AUTH0_DOMAIN}/`;
const AUTH0_PUBLIC_KEY_URL = `https://${AUTH0_DOMAIN}/.well-known/jwks.json`;
const AUTH0_REDIRECT_URI = `${APP_URL}/logged-in/`;
const AUTH0_TOKEN_URL = `https://${AUTH0_DOMAIN}/oauth/token`;

module.exports = {
  APP_URL,
  VERSION,
  IS_DEV,
  PORT,
  DASHBOARD_STATIC_ALIAS,
  DASHBOARD_MANIFEST_FILE_NAME,
  DASHBOARD_BUILD_PATH,
  DASHBOARD_MANIFEST_PATH,
  TEMPLATES_PATH,
  PUBLIC_BUILD_PATH,
  TRACKER_STATIC_ALIAS,
  TRACKER_BUILD_PATH,
  TRACKER_SCRIPT,
  SENTRY_DSN,
  ENABLE_SENTRY,
  SENTRY_ENVIRONMENT,
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_API_AUDIENCE,
  AUTH0_JWT_ISSUER,
  AUTH0_PUBLIC_KEY_URL,
  AUTH0_REDIRECT_URI,
  AUTH0_TOKEN_URL,
};
