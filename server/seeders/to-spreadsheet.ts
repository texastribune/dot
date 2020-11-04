/* eslint-disable no-console */

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

    await View.findAll({
      attributes: [
        'canonical',
        [Sequelize.fn('count', Sequelize.col('canonical')), 'views'],
      ],
      group: 'canonical',
      order: [[Sequelize.col('views'), 'DESC']],
      where: {
        visitedAt: {
          [Operation.gte]: yesterdayStart,
          [Operation.lt]: todayStart,
        },
      },
    });
  },
};
