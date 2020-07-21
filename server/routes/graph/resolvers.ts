/*  eslint-disable no-underscore-dangle */

import { GraphQLDateTime } from 'graphql-iso-date';

import {
  ViewsList,
  ViewsItemByCanonical,
  ViewsItemByDomain,
} from '../../../shared-types';
import {
  GQLContext,
  ViewsListByCanonicalArgs,
  ViewsListByDomainArgs,
} from '../../types';
import View from '../../models/view';

const resolvers = {
  DateTime: GraphQLDateTime,

  ViewsItem: {
    __resolveType(
      obj: ViewsItemByCanonical | ViewsItemByDomain
    ): string | null {
      if ('canonical' in obj) {
        return 'ViewsItemByCanonical';
      }
      if ('domain' in obj) {
        return 'ViewsItemByDomain';
      }
      return null;
    },
  },

  Query: {
    async viewsListByCanonical(
      root: undefined,
      args: ViewsListByCanonicalArgs,
      context: GQLContext
    ): Promise<ViewsList<ViewsItemByCanonical>> {
      return View.getViewsListByCanonical(context.user, args);
    },

    async viewsListByDomain(
      root: undefined,
      args: ViewsListByDomainArgs,
      context: GQLContext
    ): Promise<ViewsList<ViewsItemByDomain>> {
      return View.getViewsListByDomain(context.user, args);
    },
  },
};

export default resolvers;
