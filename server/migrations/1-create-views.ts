import { DataTypes, QueryInterface } from 'sequelize';
import { VALID_TRACKER_SOURCE } from '../config';

export = {
  up: (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.createTable('views', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      canonical: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: { isUrl: true },
      },
      domain: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          notContains: ['localhost', 's3.amazonaws.com'],
        },
      },
      source: {
        type: DataTypes.ENUM(...Object.values(VALID_TRACKER_SOURCE)),
        allowNull: false,
      },
      // eslint-disable-next-line @typescript-eslint/camelcase
      visited_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },
};
