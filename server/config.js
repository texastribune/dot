const path = require('path');
const fs = require('fs');

const certPath = path.join(process.cwd(), 'rds-combined-ca-bundle.pem');

module.exports = {
  port: process.env.PORT || 3000,
  sentryUrl: process.env.SENTRY_URL,
  db: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    ssl: {
      rejectUnauthorized: false,
      crt: fs.readFileSync(certPath).toString(),
    },
  },
};
