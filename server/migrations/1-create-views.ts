import { DataTypes, QueryInterface } from 'sequelize';

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
      },
      source: {
        type: DataTypes.ENUM('legacy', 'repub', 'rss'),
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
