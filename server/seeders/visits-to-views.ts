/* eslint-disable no-console, no-await-in-loop, @typescript-eslint/camelcase */

import { QueryInterface, QueryTypes } from 'sequelize';

import View from '../models/view';
import { ValidSource, ValidTracker } from '../../config';

interface Visit {
  id: number;
  canonical: string;
  referrer: string;
  url: string;
  visited_at: Date;
}

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const visitsCountQuery = await queryInterface.sequelize.query(
      'SELECT COUNT(*) FROM visit',
      {
        type: QueryTypes.SELECT,
      }
    );
    const { count: visitsCount } = visitsCountQuery[0] as { count: number };
    console.log(`There are ${visitsCount} rows in the table`);

    const MAX_ROWS = 10000;
    const transaction = await queryInterface.sequelize.transaction();
    let offset = 40000;
    let total = 0;

    try {
      while (offset < visitsCount) {
        const visitsQuery = await queryInterface.sequelize.query(
          `SELECT * FROM visit ORDER BY id LIMIT ${MAX_ROWS} OFFSET ${offset}`,
          {
            type: QueryTypes.SELECT,
            transaction,
          }
        );
        const visits = visitsQuery as Visit[];
        const viewsToInsert = visits.map(
          ({ canonical, referrer, url, visited_at }) => ({
            canonical,
            referrer: referrer || undefined,
            source: ValidSource.Legacy,
            tracker: ValidTracker.Script,
            url,
            version: '1.0.0',
            visited_at,
          })
        );

        await View.bulkCreate(viewsToInsert, { validate: true, transaction });

        total += visits.length;
        offset += MAX_ROWS;
        console.log(`Moved ${total} rows so far`);
      }

      const viewsCount = await View.count();

      if (viewsCount !== visitsCount) {
        throw new Error('The new table has a different number of rows');
      } else {
        transaction.commit();
        console.log('Success!');
      }
    } catch (error) {
      transaction.rollback();
      console.error(error);
    }
  },
};
