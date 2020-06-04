/* @ts-ignore */
/* eslint-disable */

import View from '../../models/view';

const resolvers = {
  Query: {
    async viewsList(root: any, args: any) {
      return await View.getViewsList(args);
    },

    async topReprinters() {
      return await View.getTopReprinters();
    },
  },
};

export default resolvers;
