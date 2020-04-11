import path from 'path';
import fs from 'fs';

import express from 'express';
import webpackDev from "webpack-dev-middleware";
import webpack from 'webpack';

import webpackConfig from '../webpack.config';

interface Assets {
  entrypoints: {
    main: {
      js: string[];
      css: string[];
    }
  }
}

interface DashboardContext {
  isDev: boolean;
  scripts?: string[];
  stylesheets?: string[];
}

const app = express();
const port = process.env.NODE_PORT;
const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  app.use(webpackDev(webpack(webpackConfig)));
}

app.set("view engine", "pug");
app.use(express.static("public"));
app.use("/static", express.static("dist"));

app.get("/dashboard", function (req, res) {
  const context: DashboardContext = { isDev };

  if (!isDev) {
    // needs error handling
    const assetsPath = path.join(process.cwd(), "dist", "assets.json");
    const assets = JSON.parse(
      fs.readFileSync(assetsPath).toString()
    ) as Assets;

    context.scripts = assets.entrypoints.main.js;
    context.stylesheets = assets.entrypoints.main.css;
  }

  res.render("dashboard", context);
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
