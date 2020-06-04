/* @ts-ignore */
/* eslint-disable */
import { GraphQLDate } from 'graphql-iso-date';

import View from '../../models/view';

const resolvers = {
  Date: GraphQLDate,

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
