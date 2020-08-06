import { QueryInterface } from 'sequelize';

export = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await Promise.all([
        queryInterface.addIndex('views', ['canonical'], {
          fields: ['canonical'],
          transaction,
          using: 'BTREE',
        }),
        queryInterface.addIndex('views', ['domain'], {
          fields: ['domain'],
          transaction,
          using: 'BTREE',
        }),
        queryInterface.addIndex('views', ['visited_at'], {
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
