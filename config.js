const path = require("path");

const IS_DEV = process.env.NODE_ENV === "development";
const PORT = parseInt(process.env.NODE_PORT);

const DASHBOARD_MANIFEST_FILE_NAME = "assets.json";
const DASHBOARD_BUILD_PATH = path.join(process.cwd(), "dist");
const DASHBOARD_MANIFEST_PATH = path.join(
  DASHBOARD_BUILD_PATH,
  DASHBOARD_MANIFEST_FILE_NAME
);
const DASHBOARD_TSCONFIG_PATH = path.join(
  process.cwd(),
  "dashboard",
  "tsconfig.json"
);

const DASHBOARD_STATIC_ALIAS = "/static/";

const TEMPLATES_PATH = path.join(process.cwd(), "server", "views");

const PUBLIC_BUILD_PATH = path.join(process.cwd(), "public");

module.exports = {
  IS_DEV,
  PORT,
  DASHBOARD_MANIFEST_FILE_NAME,
  DASHBOARD_BUILD_PATH,
  DASHBOARD_MANIFEST_PATH,
  DASHBOARD_TSCONFIG_PATH,
  DASHBOARD_STATIC_ALIAS,
  TEMPLATES_PATH,
  PUBLIC_BUILD_PATH,
};

