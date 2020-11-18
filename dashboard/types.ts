import { UserPermissions } from '../shared-types';

export interface RouteMeta {
  requiresLogIn: boolean;
  permissions: UserPermissions[];
}
