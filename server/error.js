const raven = require('raven');

const { isDev } = require('../shared-config');

function logToConsoleOrSentry(err) {
  if (isDev) {
    console.error(err); // eslint-disable-line no-console
  } else {
    raven.captureException(err);
  }
}

module.exports = logToConsoleOrSentry;
