import { QueryInterface } from 'sequelize';

export default {
  up: (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.dropTable('Visit');
  },
};
