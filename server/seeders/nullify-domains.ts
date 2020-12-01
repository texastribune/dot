/* eslint-disable no-console */

import fs from 'fs';

import { QueryInterface, Op as Operation } from 'sequelize';

import { DOMAINS_TO_NULLIFY_FILE_PATH } from '../config';

export = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    try {
      const toNullify = await new Promise<Buffer>((resolve, reject) => {
        fs.readFile(DOMAINS_TO_NULLIFY_FILE_PATH, (error, data) => {
          if (error) {
            return reject(error);
          }
          return resolve(data);
        });
      });

      const toNullifyArray = toNullify.toString().split('\n');

      // if file has a blank final line
      if (toNullifyArray[toNullifyArray.length - 1] === '') {
        toNullifyArray.pop();
      }

      const regexConditions = toNullifyArray.map((regex) => ({
        [Operation.regexp]: regex,
      }));

      const numUpdatedRows = await queryInterface.bulkUpdate(
        'views',
        {
          domain: null,
        },
        {
          domain: {
            [Operation.or]: regexConditions,
          },
        }
      );

      console.log('\x1b[33m%s\x1b[0m', `Updated ${numUpdatedRows} rows`);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log('\x1b[36m%s\x1b[0m', 'Make sure to delete the text files!');
      console.log(
        '\x1b[31m%s\x1b[0m',
        `--> rm ${DOMAINS_TO_NULLIFY_FILE_PATH}`
      );
    }
  },
};
