import { captureException, withScope } from '@sentry/node';

export default function reportError(error: Error): void {
  withScope(() => {
    captureException(error);
  });
}
