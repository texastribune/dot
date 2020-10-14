import { QueryInterface, DataTypes } from 'sequelize';

import { VALID_TRACKER_SOURCE } from '../config';

export = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.changeColumn('views', 'source', {
      type: DataTypes.ENUM(...Object.values(VALID_TRACKER_SOURCE)),
      allowNull: false,
    });
  },
};
