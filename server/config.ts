import fs from 'fs';
import path from 'path';

import pkg from '../package.json';

export const ACCESS_IDS = JSON.parse(process.env.ACCESS_IDS || '{}') as {
  [key: string]: string;
};
export const { AUTH0_CLIENT_SECRET = '' } = process.env;
export const IS_DEV = process.env.NODE_ENV === 'development';
export const IS_PROD = process.env.NODE_ENV === 'production';
export const PORT = parseInt(process.env.NODE_PORT || '3000', 10);
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
export const PUBLIC_BUILD_PATH = path.join(process.cwd(), 'public');
export const RDS_PEM = fs.readFileSync(
  path.join(process.cwd(), 'keys', 'rds.pem')
);
export const TEMPLATES_PATH = path.join(process.cwd(), 'views');
export const { TRACKER_JWT_SECRET } = process.env;
export const TRACKER_STATIC_ALIAS = '/analytics/';
export const TRACKER_BUILD_PATH = path.join(process.cwd(), 'analytics');
export const TRACKER_SCRIPT = 'pixel.js';
export const { version: VERSION } = pkg;