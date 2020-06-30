import express from 'express';

import { IS_DEV } from '../../../shared-config';
import assetsManifest from '../../../dist/assets.json';

interface Context {
  isDev: boolean;
}

interface ProdContext extends Context {
  scripts: string[];
  stylesheets: string[];
}

const router = express.Router();

router.get('/', (req, res) => {
  if (IS_DEV) {
    const context: Context = { isDev: true };
    res.render('dashboard', context);
  } else {
    const context: ProdContext = {
      isDev: false,
      scripts: assetsManifest.entrypoints.main.js,
      stylesheets: assetsManifest.entrypoints.main.css,
    };

    res.render('dashboard', context);
  }
});

export default router;
