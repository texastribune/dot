import { QueryInterface, Op as Operation } from 'sequelize';

export = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkUpdate(
      'views',
      {
        domain: null,
      },
      {
        domain: {
          [Operation.regexp]:
            '[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}',
        },
      }
    );
  },
};
