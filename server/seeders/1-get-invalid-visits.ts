/* eslint-disable no-await-in-loop, no-console */

import fs from 'fs';

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
    const visitCountQuery = await queryInterface.sequelize.query(
      'SELECT COUNT(*) FROM visit',
      {
        type: QueryTypes.SELECT,
      }
    );
    const { count: visitCount } = visitCountQuery[0] as { count: number };

    const MAX_ROWS = 10000;
    const invalidVisits: Visit[] = [];
    let offset = 0;
    let total = 0;

    try {
      while (offset < visitCount) {
        const visitsQuery = await queryInterface.sequelize.query(
          `SELECT * FROM visit ORDER BY id LIMIT ${MAX_ROWS} OFFSET ${offset}`,
          {
            type: QueryTypes.SELECT,
          }
        );
        const visits = visitsQuery as Visit[];

        visits.forEach((visit) => {
          const validCanonical = validate.isURL(visit.canonical);
          const validUrl = validate.isURL(visit.url);

          if (!validCanonical || !validUrl) {
            invalidVisits.push(visit);
          }
        });

        total += visits.length;
        offset += MAX_ROWS;
        console.log(`Checked ${total} rows so far`);
      }

      if (invalidVisits.length) {
        console.log(`There are ${invalidVisits.length} invalid visits`);

        fs.writeFileSync(
          './invalid-visits.json',
          JSON.stringify(invalidVisits)
        );
      }

      console.log('Success!');
    } catch (error) {
      console.error(error);
    }
  },
};
