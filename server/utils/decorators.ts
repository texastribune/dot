/* eslint-disable @typescript-eslint/no-explicit-any */

import { AccessTokenPayload, UserPermissions } from '../../shared-types';
import { ForbiddenError } from '../errors';

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
      user: AccessTokenPayload,
      ...args: any[]
    ): any {
      if (
        !requiredPerms.every((requiredPerm) =>
          user.permissions.includes(requiredPerm)
        )
      ) {
        throw new ForbiddenError();
      }
      return originalMethod.apply(this, [user, ...args]);
    };
  };
}
