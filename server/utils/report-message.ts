import { captureMessage, Severity } from '@sentry/node';

export default function reportMessage({
  message,
  severity = Severity.Warning,
}: {
  message: string;
  severity?: Severity;
}): void {
  // eslint-disable-next-line no-console
  console.error(message);

  captureMessage(message, severity);
}
