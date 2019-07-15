const express = require('express');
const httpLogger = require('morgan');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const raven = require('raven');

const baseRoutes = require('./base-routes');
const dashRoutes = require('./dashboard-routes');
const { sentryUrl, port } = require('./config');
const { isDev } = require('../shared-config');
const schema = require('../graphql/schema');
const logToConsoleOrSentry = require('./error');

const app = express();

// sentry request middleware
/* if (!isDev) {
  raven.config(sentryUrl, {
    captureUnhandledRejections: true,
  }).install();
  app.use(raven.requestHandler());
} */

// template set-up
app.set('view engine', 'pug');

// logging middleware
app.use(httpLogger('dev'));

// routing middleware
app.use('/', baseRoutes);
app.use('/dashboard', dashRoutes);

// static middleware
app.use(express.static('public'));

// graphql middleware
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// dev middleware
if (isDev) {
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
}

// error-handling middleware
if (!isDev) {
  // app.use(raven.errorHandler());
}
app.use((err, req, res, next) => {
  if (isDev) {
    console.error(err); // eslint-disable-line no-console
  }
  if (res.headersSent) {
    return next(err);
  }
  if (req.xhr) {
    return res.status(500).json({ error: 'Unexpected error' });
  }
  return res.status(500).render('error');
});

// listen to requests
app.listen(port, (err) => {
  if (err) {
    logToConsoleOrSentry(err);
  } else {
    console.log(`Listening at http://localhost:${port}`); // eslint-disable-line no-console
  }
});
