/* eslint-disable no-console, no-await-in-loop, @typescript-eslint/camelcase */

import { URL } from 'url';

import { QueryInterface, QueryTypes } from 'sequelize';

import View from '../models/view';
import { ValidTrackerSource } from '../types';

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

    let { count: visitsCount } = visitsCountQuery[0] as {
      count: number | string;
    };

    if (typeof visitsCount === 'string') {
      visitsCount = parseInt(visitsCount, 10);
    }

    const MAX_ROWS = 10000;
    const transaction = await queryInterface.sequelize.transaction();
    let offset = 0;
    let total = 0;

    try {
      while (offset < visitsCount) {
        const visitsQuery = await queryInterface.sequelize.query(
          `SELECT * FROM visit ORDER BY id LIMIT ${MAX_ROWS} OFFSET ${offset}`,
          {
            type: QueryTypes.SELECT,
          }
        );
        const visits = visitsQuery as Visit[];
        const viewsToInsert = visits.map(({ canonical, url, visited_at }) => ({
          canonical,
          domain: new URL(url).hostname,
          source: ValidTrackerSource.Legacy,
          visited_at,
        }));

        await View.bulkCreate(viewsToInsert, { validate: true, transaction });

        total += viewsToInsert.length;
        offset += MAX_ROWS;
        console.log(`Moved ${total} rows so far`);
      }

      await transaction.commit();
      const viewsCount = await View.count();

      if (viewsCount !== visitsCount) {
        console.error('The tables have differing rows counts');
        console.error(`Visits: ${visitsCount}`);
        console.error(`Views: ${viewsCount}`);
        console.error('Deleting the views table');
        await View.destroy({ truncate: true });
      } else {
        console.log('Success!');
      }
    } catch (error) {
      await transaction.rollback();
      console.error(error);
    }
  },
};
