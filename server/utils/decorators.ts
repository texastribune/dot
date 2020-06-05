/* eslint-disable @typescript-eslint/no-explicit-any */

import { AccessTokenPayload } from '../../shared-types';
import { UserPermissions } from '../types';

// eslint-disable-next-line import/prefer-default-export
export function userPermissions(requiredPerms: UserPermissions[]) {
  return (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): void => {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign,
    descriptor.value = function withPermissions(
      user: AccessTokenPayload | undefined,
      ...args: any[]
    ): any {
      if (
        !user ||
        !user.permissions ||
        !requiredPerms.every((requiredPerm) =>
          user.permissions.includes(requiredPerm)
        )
      ) {
        throw new Error('Insufficient permissions');
      }
      return originalMethod.apply(this, [user, ...args]);
    };
  };
}
