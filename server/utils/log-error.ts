import { captureException, withScope } from '@sentry/node';

import AppError from '../errors';

class UnknownError extends Error {
  constructor() {
    super('Malformed JavaScript error');
    this.name = 'UnknownError';
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function logError(error: any): void {
  withScope((scope) => {
    if (error.status) {
      scope.setExtra('status', error.status);
    }

    if (error instanceof AppError) {
      scope.setExtra('extra', error.extra);
    }

    if (error instanceof Error) {
      captureException(error);
    } else {
      captureException(new UnknownError());
    }
  });
}
