import { AccessTokenPayload, UserPermissions } from '../../shared-types';
import { ForbiddenError, UnauthorizedError } from '../../shared-errors';

export default function needsPermissions(
  neededPermissions: [UserPermissions],
  user: AccessTokenPayload | undefined
): void {
  if (!user) {
    throw new UnauthorizedError();
  }

  if (
    !neededPermissions.every((neededPerm) =>
      user.permissions.includes(neededPerm)
    )
  ) {
    throw new ForbiddenError();
  }
}
