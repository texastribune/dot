import { captureMessage, Severity } from '@sentry/node';

export default function reportMessage({
  message,
  severity = Severity.Warning,
}: {
  message: string;
  severity?: Severity;
}): void {
  captureMessage(message, severity);
}
