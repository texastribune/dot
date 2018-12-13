const express = require('express');
const path = require('path');

const db = require('./db');
const { isDev } = require('../shared-config');
const logToConsoleOrSentry = require('./error');

const router = express.Router();
const gif = Buffer.from('R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', 'base64');

// tracker static-assets middleware
const trackerStaticPath = path.join(process.cwd(), 'tracker', 'public');
router.use('/static', express.static(trackerStaticPath, {
  setHeaders: (res) => {
    res.header({
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=2628000',
    });
  },
}));

if (isDev) {
  router.get('/test', (req, res) => {
    res.render('test');
  });
}

function validateEntry({
  url,
  ref,
  query,
  canonical,
}) {
  const hasQueryAndRef = query !== undefined && ref !== undefined;
  const hasValidUrl = url !== undefined && (url.startsWith('http') || url.startsWith('https'));
  const hasValidCanonical = canonical !== undefined && canonical.includes('texastribune');

  return hasQueryAndRef && hasValidUrl && hasValidCanonical;
}

function addTrailingSlash(canonical) {
  if (canonical.endsWith('/')) return canonical;
  return `${canonical}/`;
}

router.get('/dot.gif', (req, res) => {
  const { url, ref, query, canonical } = req.query; // eslint-disable-line object-curly-newline

  const shouldInsertRow = validateEntry({
    url,
    ref,
    query,
    canonical,
  });

  if (shouldInsertRow) {
    const dbQuery = {
      text: 'INSERT INTO visit (url, referrer, query, canonical) VALUES ($1, $2, $3, $4)',
      values: [url, ref, query, addTrailingSlash(canonical)],
    };

    db.connect()
      .then(client => (
        client.query(dbQuery)
          .then(() => {
            client.release();
          })
          .catch((err) => {
            client.release();
            throw err;
          })
      ))
      .catch((err) => {
        logToConsoleOrSentry(err);
      });
  }

  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'image/gif',
    'Content-Length': gif.length,
  });

  res.send(gif);
});

module.exports = router;
