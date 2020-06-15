import { DataTypes, QueryInterface } from 'sequelize';
import { ValidTrackerSource, ValidTrackerType } from '../types';

export default {
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
        allowNull: false,
        validate: {
          notContains: ['localhost', 's3.amazonaws.com'],
        },
      },
      referrer: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      source: {
        type: DataTypes.ENUM(...Object.values(ValidTrackerSource)),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(ValidTrackerType)),
        allowNull: false,
      },
      version: {
        type: DataTypes.STRING(8),
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
