import { captureException, withScope } from '@sentry/node';

import { NetworkError } from '../../shared-errors';

export default function reportNetworkError(error: NetworkError): void {
  withScope((scope) => {
    scope.setExtra('network', error.formatForSentry());
    captureException(error);
  });
}
