import { Sequelize } from 'sequelize';

import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from '../config';

const db = new Sequelize({
  database: DB_NAME,
  dialect: 'postgres',
  host: DB_HOST,
  password: DB_PASSWORD,
  port: DB_PORT,
  username: DB_USER,
});

export default db;
