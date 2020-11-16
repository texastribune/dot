// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import pg from 'pg';

import {
  RDS_PEM,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
  DB_PORT,
} from './config';

// https://github.com/sequelize/sequelize/issues/2383
pg.defaults.parseInt8 = true;

export = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres' as const,
  },
  staging: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres' as const,
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres' as const,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
        ca: [RDS_PEM],
      },
    },
  },
};
