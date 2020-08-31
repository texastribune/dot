import { captureException, withScope } from '@sentry/node';

import { NetworkError } from '../../shared-errors';
import { EnhancedError } from '../errors';

export default function reportError(
  error: EnhancedError,
  extra?: object
): void {
  withScope((scope) => {
    if (error instanceof NetworkError) {
      scope.setExtra('network', error.formatForSentry());
    } else if (error.status) {
      scope.setExtra('status', error.status);
    }

    if (extra) {
      scope.setExtra('extra', extra);
    }

    if (!error.status || error.status >= 500) {
      captureException(error);
    }

    // eslint-disable-next-line no-console
    console.error(error.name);
    // eslint-disable-next-line no-console
    console.error(error.message);
    // eslint-disable-next-line no-console
    console.error(error.stack);
  });
}
