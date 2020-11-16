import fs from 'fs';
import path from 'path';

import pkg from '../package.json';

// ==============================================================================
// AUTHENTICATION
// ==============================================================================
export const ACCESS_ID = process.env.ACCESS_ID || '';
export const { AUTH0_CLIENT_SECRET = '' } = process.env;

// ==============================================================================
// CACHING
// ==============================================================================
export const DEFAULT_CACHE_TIME = 300;

// ==============================================================================
// BASICS
// ==============================================================================
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';
export const DASHBOARD_STATIC_ALIAS = '/static/';
export const DASHBOARD_MANIFEST_FILE_NAME = 'assets.json';
export const DASHBOARD_BUILD_PATH = path.join(process.cwd(), 'dist');
export const DASHBOARD_MANIFEST_PATH = path.join(
  DASHBOARD_BUILD_PATH,
  DASHBOARD_MANIFEST_FILE_NAME
);
export const { NODE_ENV } = process.env;
export const PORT = parseInt(process.env.NODE_PORT || '3000', 10);
export const PUBLIC_BUILD_PATH = path.join(process.cwd(), 'public');
export const TEMPLATES_PATH = path.join(process.cwd(), 'views');
export const { TRACKER_JWT_SECRET } = process.env;
export const TRACKER_STATIC_ALIAS = '/analytics/';
export const TRACKER_BUILD_PATH = path.join(process.cwd(), 'analytics');
export const TRACKER_SCRIPT = 'pixel.js';
export const { version: VERSION } = pkg;
export enum VALID_TRACKER_SOURCE {
  Legacy = 'legacy',
  Manual = 'manual',
  Repub = 'repub',
  Rss = 'rss',
  DataViz = 'dataviz',
}

// ==============================================================================
// DATABASE
// ==============================================================================
export const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
export const {
  DB_HOST = 'dot-db',
  DB_NAME = 'dot',
  DB_PASSWORD = 'postgres',
  DB_USER = 'postgres',
} = process.env;
export const RDS_PEM = fs.readFileSync(
  path.join(process.cwd(), 'keys', 'rds-combined-ca-bundle.pem')
);

// ==============================================================================
// GOOGLE SPREADSHEETS
// ==============================================================================
export const {
  GOOGLE_SERVICE_ACCOUNT_EMAIL = '',
  GOOGLE_SPREADSHEET_ID = '',
} = process.env;
export const GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = process.env
  .GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  ? process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/gm, '\n')
  : '';

// ==============================================================================
// SEEDERS
// ==============================================================================
export const BAD_DOMAINS_FILE_PATH = path.join(
  process.cwd(),
  'reports',
  'bad-domains.txt'
);
export const NEW_DOMAINS_FILE_PATH = path.join(
  process.cwd(),
  'reports',
  'new-domains.txt'
);
export const DOMAINS_TO_NULLIFY_FILE_PATH = path.join(
  process.cwd(),
  'reports',
  'domains-to-nullify.txt'
);
