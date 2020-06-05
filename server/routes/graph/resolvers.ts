import { GraphQLDate } from 'graphql-iso-date';

import { GQLContext } from '../../types';
import View from '../../models/view';

const resolvers = {
  Date: GraphQLDate,

  Query: {
    async viewsList(root: undefined, args: any, context: GQLContext) {
      return View.getViewsList(context.user, args);
    },

    async topReprinters(root: undefined, args: undefined, context: GQLContext) {
      return View.getTopReprinters(context.user);
    },
  },
};

export default resolvers;
