import { captureException, withScope } from '@sentry/node';

import { NetworkError } from '../../shared-errors';
import { EnhancedError } from '../errors';
import logError from './log-error';

export default function reportError(
  error: EnhancedError,
  { forceReport = false }: { forceReport: boolean } = { forceReport: false }
): void {
  withScope((scope) => {
    if (error instanceof NetworkError) {
      scope.setExtra('network', error.formatForSentry());
    } else if (error.status) {
      scope.setExtra('status', error.status);
    }

    if (!error.status || error.status >= 500 || forceReport) {
      captureException(error);
    }

    logError(error);
  });
}
