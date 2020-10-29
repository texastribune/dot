import fs from 'fs';
import path from 'path';

// import moment from 'moment';
// import { Op as Operation } from 'sequelize';

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

    const fileName = 'new-domains.txt';
    const filePath = path.join(process.cwd(), 'reports', fileName);

    try {
      const message = await new Promise((resolve, reject) => {
        fs.writeFile(filePath, toWrite, async (error) => {
          if (error) {
            return reject(error);
          }
          return resolve(
            `Wrote ${fileName} with ${domains.length} new domains`
          );
        });
      });

      // eslint-disable-next-line no-console
      console.log(message);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  },
};
