export default function logError(error: Error): void {
  // eslint-disable-next-line no-console
  console.error(error.name);
  // eslint-disable-next-line no-console
  console.error(error.message);
  // eslint-disable-next-line no-console
  console.error(error.stack);
}
