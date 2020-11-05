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
import needsPermission from '../../utils/needs-permission';
import GraphQLUrl from './scalars/url';

const resolvers = {
  Url: GraphQLUrl,

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
      needsPermission(['dot:view_data'], context.user);
      return View.getViewsListByCanonical(args);
    },

    async viewsListByDomain(
      root: undefined,
      args: ViewsListByDomainArgs,
      context: GQLContext
    ): Promise<ViewsList<ViewsItemByDomain>> {
      needsPermission(['dot:view_data'], context.user);
      return View.getViewsListByDomain(args);
    },
  },
};

export default resolvers;
