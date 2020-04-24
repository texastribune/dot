import { captureException, withScope, Severity } from '@sentry/node';

import AppError from '../errors';

export default function logError({
  error,
  level = Severity.Error,
}: {
  error: AppError;
  level?: Severity;
}): void {
  withScope((scope) => {
    scope.setExtra('status', error.status);
    scope.setLevel(level);

    if (error.extra) {
      scope.setExtra('meta', error.extra);
    }

    captureException(error);
  });
}
