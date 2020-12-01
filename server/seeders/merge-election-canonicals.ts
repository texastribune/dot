/* eslint-disable no-console */

import { QueryInterface, Op as Operation } from 'sequelize';

export = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const numUpdatedRows = await queryInterface.bulkUpdate(
      'views',
      {
        canonical:
          'https://apps.texastribune.org/features/2020/general-election-results/embeds/partner/',
      },
      {
        canonical: {
          [Operation.startsWith]:
            'https://apps.texastribune.org/features/2020/general-election-results/embeds/partner/',
        },
      }
    );

    console.log('\x1b[33m%s\x1b[0m', `Updated ${numUpdatedRows} rows`);
  },
};
