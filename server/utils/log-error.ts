import { captureException, withScope } from '@sentry/node';

import AppError from '../errors';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function logError(error: any): void {
  withScope((scope) => {
    if (error.status) {
      scope.setExtra('status', error.status);
    }

    if (error instanceof AppError) {
      scope.setExtra('extra', error.extra);
    }

    captureException(error);
  });
}
