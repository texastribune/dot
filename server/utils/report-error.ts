import { captureException } from '@sentry/node';

export default function reportError(error: Error): void {
  captureException(error);
}
