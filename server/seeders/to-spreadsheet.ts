/* eslint-disable no-console */

import fs from 'fs';

import moment from 'moment-timezone';
import { Sequelize, Op as Operation } from 'sequelize';

import { TIMEZONE } from '../../shared-config';
import View from '../models/view';

export = {
  up: async (): Promise<void> => {
    const yesterdayStart = moment()
      .tz(TIMEZONE)
      .subtract(1, 'day')
      .startOf('day')
      .toDate();

    const todayStart = moment().tz(TIMEZONE).startOf('day').toDate();

    const data = await View.findAll({
      attributes: [
        'canonical',
        'domain',
        [Sequelize.fn('count', Sequelize.col('*')), 'views'],
      ],
      group: ['canonical', 'domain'],
      order: [
        ['canonical', 'ASC'],
        [Sequelize.col('views'), 'DESC'],
      ],
      where: {
        visitedAt: {
          [Operation.gte]: yesterdayStart,
          [Operation.lt]: todayStart,
        },
      },
    });

    const csv = data.reduce(
      (acc, view) =>
        `${acc}${view.canonical},${view.domain},${view.get('views')}\n`,
      'canonical,domain,views\n'
    );

    fs.writeFileSync('foo.csv', csv);
  },
};
