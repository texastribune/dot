/* eslint-disable no-await-in-loop, no-console */

import validate from 'validator';

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

    try {
      while (offset < visitsCount) {
        const visitsQuery = await queryInterface.sequelize.query(
          `SELECT * FROM visit ORDER BY id LIMIT ${MAX_ROWS} OFFSET ${offset}`,
          {
            type: QueryTypes.SELECT,
          }
        );
        const visits = visitsQuery as Visit[];
        const invalidVisits: Visit[] = [];

        visits.forEach((visit) => {
          const validCanonical = validate.isURL(visit.canonical);
          const validUrl =
            validate.isURL(visit.url) &&
            !validate.contains(visit.url, 'localhost') &&
            !validate.contains(visit.url, 's3.amazonaws.com');

          if (!validCanonical || !validUrl) {
            invalidVisits.push(visit);
          }
        });

        if (invalidVisits.length) {
          const invalidVisitIds = invalidVisits.map(({ id }) => id);
          console.log(`Deleting ${invalidVisits.length} invalid visits`);

          await queryInterface.sequelize.query(
            'DELETE FROM visit WHERE id IN (?)',
            {
              type: QueryTypes.DELETE,
              replacements: [invalidVisitIds],
              transaction,
            }
          );
        }

        offset += MAX_ROWS;
      }

      await transaction.commit();
      console.log('Success!');
    } catch (error) {
      await transaction.rollback();
      console.error(error);
    }
  },
};
