import Raven from 'raven-js';

import sharedConfig from '../shared-config';

const { isDev } = sharedConfig;

export default function logToConsoleOrSentry(err) {
  if (isDev) {
    console.error(err); // eslint-disable-line no-console
  } else {
    try {
      throw err;
    } catch (e) {
      Raven.captureException(e);
    }
  }
}
