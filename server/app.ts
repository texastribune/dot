import path from 'path';
import fs from 'fs';

import express from 'express';

interface Assets {
  entrypoints: {
    main: {
      js: string[];
      css: string[];
    }
  }
}

const app = express();
const assetsPath = path.join(process.cwd(), 'dist', 'assets.json');
const assets = JSON.parse(fs.readFileSync(assetsPath).toString()) as Assets;
const port = process.env.NODE_PORT;

app.set("view engine", "pug");

app.use(express.static("public"));
app.use("/static", express.static("dist"));

app.get("/dashboard", function (req, res) {
  res.render("dashboard", {
    scripts: assets.entrypoints.main.js,
    stylesheets: assets.entrypoints.main.css,
    isDev: process.env.NODE_ENV === 'development',
  });
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
