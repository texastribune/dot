/* @ts-ignore */
/* eslint-disable */

import View from '../../models/view';

const resolvers = {
  Query: {
    async reprints(root: any, args: any) {
      return await View.getReprints(args);
    },
  },
};

export default resolvers;
