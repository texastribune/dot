import { QueryInterface } from 'sequelize';

export = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable('visit');
  },
};
