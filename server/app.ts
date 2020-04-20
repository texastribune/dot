// eslint-disable-next-line import/no-extraneous-dependencies
import webpackDev from 'webpack-dev-middleware';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';
import express from 'express';
import connectSlashes from 'connect-slashes';
import * as Sentry from '@sentry/node';

import routes from './routes';
import webpackConfig from '../webpack.config';
import {
  IS_DEV,
  PORT,
  DASHBOARD_STATIC_ALIAS,
  DASHBOARD_BUILD_PATH,
  TEMPLATES_PATH,
  PUBLIC_BUILD_PATH,
} from '../config';

Sentry.init({ dsn: '' });

const app = express();

app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);

app.set('views', TEMPLATES_PATH);
app.set('view engine', 'pug');

app.use(express.static(PUBLIC_BUILD_PATH));
app.use(DASHBOARD_STATIC_ALIAS, express.static(DASHBOARD_BUILD_PATH));
app.use(connectSlashes());

if (IS_DEV) {
  app.use(webpackDev(webpack(webpackConfig as webpack.Configuration)));
}

app.get('/', (req, res) => {
  res.redirect(302, '/dashboard');
});
app.use(routes);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at port ${PORT}`);
});
