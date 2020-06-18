import { GraphQLDate } from 'graphql-iso-date';

import {
  ReprinterItem,
  ViewsList,
  ViewsListByCanonicalArgs,
  ViewsListByDomainArgs,
} from '../../../shared-types';
import { GQLContext } from '../../types';
import View from '../../models/view';

const resolvers = {
  Date: GraphQLDate,

  Query: {
    async viewsListByCanonical(
      root: undefined,
      args: ViewsListByCanonicalArgs,
      context: GQLContext
    ): Promise<ViewsList> {
      return View.getViewsListByCanonical(context.user, args);
    },

    async viewsListByDomain(
      root: undefined,
      args: ViewsListByDomainArgs,
      context: GQLContext
    ): Promise<ViewsList> {
      return View.getViewsListByDomain(context.user, args);
    },

    async topReprinters(
      root: undefined,
      args: undefined,
      context: GQLContext
    ): Promise<ReprinterItem[]> {
      return View.getTopReprinters(context.user);
    },
  },
};

export default resolvers;
