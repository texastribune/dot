// eslint-disable-next-line
const path = require('path');

const IS_DEV = process.env.NODE_ENV === 'development';
const PORT = parseInt(process.env.NODE_PORT, 10);

const DASHBOARD_MANIFEST_FILE_NAME = 'assets.json';
const DASHBOARD_BUILD_PATH = path.join(process.cwd(), 'dist');
const DASHBOARD_MANIFEST_PATH = path.join(
  DASHBOARD_BUILD_PATH,
  DASHBOARD_MANIFEST_FILE_NAME
);
const DASHBOARD_STATIC_ALIAS = '/static/';

const TEMPLATES_PATH = path.join(process.cwd(), 'server', 'views');

const PUBLIC_BUILD_PATH = path.join(process.cwd(), 'public');

const { SENTRY_DSN, SENTRY_ENVIRONMENT } = process.env;
const ENABLE_SENTRY = process.env.ENABLE_SENTRY === 'true';

module.exports = {
  IS_DEV,
  PORT,
  DASHBOARD_MANIFEST_FILE_NAME,
  DASHBOARD_BUILD_PATH,
  DASHBOARD_MANIFEST_PATH,
  DASHBOARD_STATIC_ALIAS,
  TEMPLATES_PATH,
  PUBLIC_BUILD_PATH,
  SENTRY_DSN,
  ENABLE_SENTRY,
  SENTRY_ENVIRONMENT,
};
