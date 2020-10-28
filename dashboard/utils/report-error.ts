import { captureException, withScope } from '@sentry/browser';

export default function reportError(error: Error): void {
  withScope(() => {
    captureException(error);
  });
}
