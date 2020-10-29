/* eslint-disable no-console */

import fs from 'fs';

import { Op as Operation } from 'sequelize';

import { BAD_DOMAINS_FILE_PATH, NEW_DOMAINS_FILE_PATH } from '../config';
import View from '../models/view';

export = {
  up: async (): Promise<void> => {
    try {
      const badDomains = await new Promise<Buffer>((resolve, reject) => {
        fs.readFile(BAD_DOMAINS_FILE_PATH, (error, data) => {
          if (error) {
            return reject(error);
          }
          return resolve(data);
        });
      });

      const domainsArray = badDomains.toString().split('\n');
      const numDeletedRows = await View.destroy({
        where: {
          domain: {
            [Operation.and]: {
              [Operation.not]: null,
              [Operation.or]: domainsArray,
            },
          },
        },
      });

      console.log('\x1b[33m%s\x1b[0m', `Deleted ${numDeletedRows} rows`);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log('\x1b[36m%s\x1b[0m', 'Make sure to delete the text files!');
      console.log('\x1b[31m%s\x1b[0m', `--> rm ${NEW_DOMAINS_FILE_PATH}`);
      console.log('\x1b[31m%s\x1b[0m', `--> rm ${BAD_DOMAINS_FILE_PATH}`);
    }
  },
};
