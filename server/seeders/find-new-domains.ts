/* eslint-disable no-console */

import fs from 'fs';

// import moment from 'moment';
// import { Op as Operation } from 'sequelize';

import { NEW_DOMAINS_FILE_PATH } from '../config';
import View from '../models/view';

export = {
  up: async (): Promise<void> => {
    // const today = new Date();
    // const oneMonthOneWeekAgo = moment()
    //   .subtract(1, 'month')
    //   .subtract(1, 'week');

    const domains = await View.findAll({
      attributes: ['domain'],
      group: ['domain'],
      // where: {
      //   visitedAt: {
      //     [Operation.gte]: oneMonthOneWeekAgo,
      //     [Operation.lt]: today,
      //   },
      // },
    });

    const toWrite = domains.reduce(
      (acc, curr) => `${acc}${curr.getDataValue('domain')}\n`,
      ''
    );

    try {
      const message = await new Promise((resolve, reject) => {
        fs.writeFile(NEW_DOMAINS_FILE_PATH, toWrite, async (error) => {
          if (error) {
            return reject(error);
          }
          return resolve(`Wrote ${domains.length} new domains`);
        });
      });

      console.log('\x1b[33m%s\x1b[0m', message);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(
        '\x1b[36m%s\x1b[0m',
        'If not deleting any domains, make sure to delete the text file!'
      );
      console.log('\x1b[31m%s\x1b[0m', `--> rm ${NEW_DOMAINS_FILE_PATH}`);
    }
  },
};
