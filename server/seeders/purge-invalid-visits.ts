/* eslint-disable no-await-in-loop, no-console */

import { QueryInterface, QueryTypes } from 'sequelize';

interface Visit {
  id: number;
  canonical: string;
  referrer: string;
  url: string;
  visited_at: Date;
}

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const badVisitsQuery = await queryInterface.sequelize.query(
        `SELECT id FROM visit
        WHERE url LIKE '%localhost%' OR
        (url LIKE '%blogspot.com%' AND url LIKE '%preview%') OR
        url LIKE 'http:///' OR
        url LIKE 'http://appyet_base/%' OR
        id = 55664 OR
        id = 1319147 OR
        id = 976248 OR
        id = 4357709 OR
        id = 1862496`,
        {
          type: QueryTypes.SELECT,
          transaction,
        }
      );
      const badVisits = badVisitsQuery as Visit[];
      const badVisitIds = badVisits.map(({ id }) => id);

      await queryInterface.sequelize.query(
        'DELETE FROM visit WHERE id IN (?)',
        {
          type: QueryTypes.DELETE,
          replacements: [badVisitIds],
          transaction,
        }
      );

      transaction.commit();
      console.log(`Success! Deleted ${badVisits.length} rows`);
    } catch (error) {
      transaction.rollback();
      console.error(error);
    }
  },
};
