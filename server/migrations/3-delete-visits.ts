import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    try {
      await queryInterface.dropTable('visit');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Unable to drop the "visit" table');
    }
  },
};
