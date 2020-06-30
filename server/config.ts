import fs from 'fs';
import path from 'path';

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
export const TEMPLATES_PATH = path.join(process.cwd(), 'views');
export const TRACKER_STATIC_ALIAS = '/analytics/';
export const TRACKER_BUILD_PATH = path.join(process.cwd(), 'analytics');
export const TRACKER_SCRIPT = 'pixel.js';
