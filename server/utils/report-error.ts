import { captureException, withScope } from '@sentry/node';

import { AppError, EnhancedError } from '../errors';

export default function reportError(error: EnhancedError): void {
  withScope((scope) => {
    if (error.status) {
      scope.setExtra('status', error.status);
    }

    if (error instanceof AppError) {
      scope.setExtra('extra', error.extra);
    }

    // eslint-disable-next-line no-console
    console.error(error.name);
    // eslint-disable-next-line no-console
    console.error(error.message);
    // eslint-disable-next-line no-console
    console.error(error.stack);

    captureException(error);
  });
}
