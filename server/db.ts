import { Sequelize } from 'sequelize';

import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  IS_PROD,
  IS_DEV,
  RDS_PEM,
} from './config';

const db = new Sequelize({
  database: DB_NAME,
  dialect: 'postgres',
  host: DB_HOST,
  logging: IS_DEV
    ? (sql): void => {
        // eslint-disable-next-line no-console
        console.log(sql);
      }
    : false,
  password: DB_PASSWORD,
  port: DB_PORT,
  username: DB_USER,
  dialectOptions: IS_PROD
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
          crt: RDS_PEM.toString(),
        },
      }
    : undefined,
});

export default db;
