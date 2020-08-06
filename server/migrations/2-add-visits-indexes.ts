import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await Promise.all([
        queryInterface.addIndex('visit', ['canonical'], {
          fields: ['canonical'],
          transaction,
          using: 'BTREE',
        }),
        queryInterface.addIndex('visit', ['url'], {
          fields: ['url'],
          transaction,
          using: 'BTREE',
        }),
        queryInterface.addIndex('visit', ['visited_at'], {
          fields: ['visited_at'],
          transaction,
          using: 'BTREE',
        }),
      ]);

      transaction.commit();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      transaction.rollback();
      throw err;
    }
  },
};
