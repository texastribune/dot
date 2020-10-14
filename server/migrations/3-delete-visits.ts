import { QueryInterface } from 'sequelize';

// drop this migration if adopting full open-source support
export = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable('visit');
  },
};
