import fs from 'fs';
import path from 'path';

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
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_API_AUDIENCE = 'https://texastribune.org/dot',
} = process.env;
export const AUTH0_JWT_ISSUER = `https://${AUTH0_DOMAIN}/`;
export const AUTH0_PUBLIC_KEY_URL = `https://${AUTH0_DOMAIN}/.well-known/jwks.json`;
export const AUTH0_REDIRECT_URI = `${APP_URL}/logged-in/`;
export const AUTH0_TOKEN_URL = `https://${AUTH0_DOMAIN}/oauth/token`;

export const DASHBOARD_STATIC_ALIAS = '/static/';
export const DASHBOARD_MANIFEST_FILE_NAME = 'assets.json';
export const DASHBOARD_BUILD_PATH = path.join(process.cwd(), 'dist');
export const DASHBOARD_MANIFEST_PATH = path.join(
  DASHBOARD_BUILD_PATH,
  DASHBOARD_MANIFEST_FILE_NAME
);

export const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
export const {
  DB_HOST = 'dot-db',
  DB_NAME = 'dot',
  DB_PASSWORD = 'postgres',
  DB_USER = 'postgres',
} = process.env;

export const RDS_PEM = fs.readFileSync(
  path.join(process.cwd(), 'keys', 'rds.pem')
);

export const { TRACKER_JWT_SECRET } = process.env;

export const PUBLIC_BUILD_PATH = path.join(process.cwd(), 'public');

export const { SENTRY_DSN, SENTRY_ENVIRONMENT } = process.env;
export const ENABLE_SENTRY = process.env.ENABLE_SENTRY === 'true';

export const TEMPLATES_PATH = path.join(process.cwd(), 'views');

export const TRACKER_STATIC_ALIAS = '/analytics/';
export const TRACKER_BUILD_PATH = path.join(process.cwd(), 'analytics');
export const TRACKER_SCRIPT = 'pixel.js';
