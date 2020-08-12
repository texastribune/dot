import { USER_PERMISSIONS } from '../shared-config';

export interface RouteMeta {
  requiresLogIn: boolean;
  permissions: USER_PERMISSIONS[];
}
