const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../dashboard/webpack/config.dev');
const { isDev } = require('../shared-config');

const router = express.Router();
const compiler = webpack(webpackConfig);

const dashStaticPath = path.join(process.cwd(), 'dashboard', 'public');
router.use('/static', express.static(dashStaticPath, {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-cache');
  },
}));

if (isDev) {
  router.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }));
  router.use(webpackHotMiddleware(compiler));
}

router.get('*', (req, res) => {
  res.render('dashboard', { isDev });
});

module.exports = router;
