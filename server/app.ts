import fs from 'fs';

import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpackDev from 'webpack-dev-middleware';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';

import webpackConfig from '../webpack.config';
import {
  IS_DEV,
  PORT,
  DASHBOARD_MANIFEST_PATH,
  DASHBOARD_STATIC_ALIAS,
  DASHBOARD_BUILD_PATH,
  TEMPLATES_PATH,
  PUBLIC_BUILD_PATH,
} from '../config';

interface Assets {
  entrypoints: {
    main: {
      js: string[];
      css: string[];
    };
  };
}

interface Context {
  isDev: boolean;
}

interface ProdContext extends Context {
  scripts: string[];
  stylesheets: string[];
}

const app = express();

app.set('views', TEMPLATES_PATH);
app.set('view engine', 'pug');

app.use(express.static(PUBLIC_BUILD_PATH));
app.use(DASHBOARD_STATIC_ALIAS, express.static(DASHBOARD_BUILD_PATH));

// TODO: better TS for req and res
app.get('/dashboard', (req, res) => {
  if (IS_DEV) {
    const context: Context = { isDev: true };

    res.render('dashboard', context);
  } else {
    const assets = JSON.parse(
      fs.readFileSync(DASHBOARD_MANIFEST_PATH).toString()
    ) as Assets;

    const context: ProdContext = {
      isDev: false,
      scripts: assets.entrypoints.main.js,
      stylesheets: assets.entrypoints.main.css,
    };

    res.render('dashboard', context);
  }
});

if (IS_DEV) {
  app.use(webpackDev(webpack(webpackConfig as webpack.Configuration)));
}

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at port ${PORT}`);
});
