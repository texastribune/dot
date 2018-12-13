const { Pool } = require('pg');

const config = require('./config');
const { isProd } = require('../shared-config');
const logToConsoleOrSentry = require('./error');

const {
  db: {
    database,
    password,
    host,
    user,
    port,
    ssl,
  },
} = config;

const dbConfig = {
  database,
  user,
  password,
  host,
  port,
};

if (isProd) {
  dbConfig.ssl = ssl;
}

const pool = new Pool(dbConfig);

pool.on('error', (err) => {
  if (err) {
    logToConsoleOrSentry(err);
  }
});

module.exports = pool;
