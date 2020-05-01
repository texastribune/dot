import { captureException, withScope } from '@sentry/node';

import { AppError, EnhancedError } from '../errors';

export default function logError(error: EnhancedError): void {
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
