/* eslint-disable no-console, @typescript-eslint/camelcase */

import moment from 'moment-timezone';
import { Sequelize, Op as Operation } from 'sequelize';
import { GoogleSpreadsheet } from 'google-spreadsheet';

import { TIMEZONE } from '../../shared-config';
import View from '../models/view';
import {
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  GOOGLE_SPREADSHEET_ID,
} from '../config';

export = {
  up: async (): Promise<void> => {
    const yesterdayStart = moment()
      .tz(TIMEZONE)
      .subtract(1, 'day')
      .startOf('day')
      .toDate();

    const todayStart = moment().tz(TIMEZONE).startOf('day').toDate();

    const viewGroups = await View.findAll({
      attributes: [
        'canonical',
        'domain',
        [Sequelize.fn('count', Sequelize.col('*')), 'views'],
      ],
      group: ['canonical', 'domain'],
      order: [['canonical', 'ASC']],
      where: {
        visitedAt: {
          [Operation.gte]: yesterdayStart,
          [Operation.lt]: todayStart,
        },
      },
    });

    const doc = new GoogleSpreadsheet(GOOGLE_SPREADSHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    });
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    await sheet.clear();
    await sheet.setHeaderRow(['canonical', 'domain', 'views']);

    const rows = viewGroups.map((group) => ({
      canonical: group.canonical,
      domain: group.domain || 'null',
      views: group.get('views') as number,
    }));

    await sheet.addRows(rows);
  },
};
