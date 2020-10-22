import { QueryInterface } from 'sequelize';

export = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_views_source" ADD VALUE 'manual'`
      );
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_views_source" ADD VALUE 'dataviz'`
      );

      transaction.commit();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      transaction.rollback();
      throw err;
    }
  },
};
