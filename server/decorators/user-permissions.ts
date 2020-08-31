/* eslint-disable @typescript-eslint/no-explicit-any */

import { USER_PERMISSIONS } from '../../shared-config';
import { AccessTokenPayload } from '../../shared-types';
import { InsufficientPermissionsError } from '../errors';

export default function userPermissions(requiredPerms: USER_PERMISSIONS[]) {
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
        throw new InsufficientPermissionsError();
      }
      return originalMethod.apply(this, [user, ...args]);
    };
  };
}
