const path = require('path');

module.exports = {
  OUTPUT_PATH: path.join(process.cwd(), 'dashboard', 'public', 'dist'),
  ENTRY_PATH: path.join(process.cwd(), 'dashboard', 'vue', 'index'),
  PUBLIC_PATH_PROD: '/dashboard/static/dist/',
  BUNDLE_NAME: 'dashboard',
};
