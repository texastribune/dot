import { ApolloError } from 'apollo-client';
import { captureException, withScope } from '@sentry/browser';

import { NetworkError } from '../../shared-errors';

export default function reportError(error: Error): void {
  withScope((scope) => {
    if (error instanceof NetworkError) {
      scope.setExtra('network', error.formatForSentry());
    } else if (error instanceof ApolloError) {
      scope.setExtra('networkError', error.networkError);
      scope.setExtra('gqlErrors', error.graphQLErrors);
    }

    captureException(error);
  });
}
