import { Sequelize } from 'sequelize';

import sequelizeEnvs from './sequelize';
import { Environments } from './types';
import { IS_DEV, NODE_ENV } from './config';

const db = new Sequelize({
  ...sequelizeEnvs[NODE_ENV as Environments],
  logging: IS_DEV
    ? (sql): void => {
        // eslint-disable-next-line no-console
        console.log(sql);
      }
    : false,
});

export default db;
