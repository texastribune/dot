const db = require('../server/db');
const logToConsoleOrSentry = require('../server/error');

const TABLE = 'visit';
const DOMAIN_REGEX = '.*://([^/]*)';

const resolvers = {
  ArticleDetail: {
    allReprinters: (root, { canonical, startDate, endDate }) => {
      const values = [startDate, endDate, canonical];
      const text = `
        SELECT (regexp_matches(url, '${DOMAIN_REGEX}'))[1] as domain, canonical, COUNT(*) as views
        FROM ${TABLE}
        WHERE (visited_at BETWEEN $1 AND $2) AND (canonical = $3)
        GROUP BY domain, canonical
        ORDER BY COUNT(*) DESC
      `;

      return db.connect()
        .then(client => (
          client.query({ text, values })
            .then(({ rows }) => {
              client.release();
              return rows;
            })
            .catch((err) => {
              client.release();
              throw err;
            })
        ))
        .catch((err) => {
          logToConsoleOrSentry(err);
        });
    },
  },

  ReprinterDetail: {
    allArticles: (root, { domain, startDate, endDate }) => {
      const tempValues = [startDate, endDate];
      const queryValues = [domain];
      const tempTable = 'temp3';
      const tempText = `
        CREATE TEMPORARY TABLE IF NOT EXISTS ${tempTable} AS
        (
          SELECT (regexp_matches(url, '${DOMAIN_REGEX}'))[1] as domain, canonical, COUNT(*) as total
          FROM ${TABLE}
          WHERE (visited_at BETWEEN $1 AND $2)
          GROUP BY domain, canonical
        )
      `;
      const queryText = `
        SELECT canonical, SUM(total) AS views
        FROM ${tempTable}
        WHERE domain = $1
        GROUP BY canonical
        ORDER BY SUM(total) DESC
      `;
      const deleteQuery = `
        DROP TABLE ${tempTable}
      `;

      return db.connect()
        .then(client => (
          client.query({ text: tempText, values: tempValues })
            .then(() => (
              client.query({ text: queryText, values: queryValues })
                .then(({ rows }) => (
                  client.query(deleteQuery)
                    .then(() => {
                      client.release();
                      return rows;
                    })
                    .catch((err) => {
                      client.release();
                      throw err;
                    })
                ))
                .catch((err) => {
                  client.release();
                  throw err;
                })
            ))
            .catch((err) => {
              client.release();
              throw err;
            })
        ))
        .catch((err) => {
          logToConsoleOrSentry(err);
        });
    },
  },

  Summary: {
    topArticles: (root, { startDate, endDate }) => {
      const values = [startDate, endDate];
      const text = `
        SELECT canonical, COUNT(*) AS views
        FROM ${TABLE}
        WHERE visited_at BETWEEN $1 AND $2
        GROUP BY canonical
        ORDER BY COUNT(*) DESC
      `;

      return db.connect()
        .then(client => (
          client.query({ text, values })
            .then(({ rows }) => {
              client.release();
              return rows;
            })
            .catch((err) => {
              client.release();
              throw err;
            })
        ))
        .catch((err) => {
          logToConsoleOrSentry(err);
        });
    },

    topReprinters: (root, { startDate, endDate }) => {
      const values = [startDate, endDate];
      const tempTable = 'temp1';
      const tempText = `
        CREATE TEMPORARY TABLE IF NOT EXISTS ${tempTable} AS
        (
          SELECT (regexp_matches(url, '${DOMAIN_REGEX}'))[1] as domain, canonical
          FROM ${TABLE}
          WHERE visited_at BETWEEN $1 AND $2
          GROUP BY domain, canonical
        )
      `;
      const queryText = `
        SELECT domain, COUNT(domain) as reprints
        FROM ${tempTable}
        GROUP BY domain
        ORDER BY COUNT(domain) DESC
      `;
      const deleteQuery = `
        DROP TABLE ${tempTable}
      `;

      return db.connect()
        .then(client => (
          client.query({ text: tempText, values })
            .then(() => (
              client.query(queryText)
                .then(({ rows }) => (
                  client.query(deleteQuery)
                    .then(() => {
                      client.release();
                      return rows;
                    })
                    .catch((err) => {
                      client.release();
                      throw err;
                    })
                ))
                .catch((err) => {
                  client.release();
                  throw err;
                })
            ))
            .catch((err) => {
              client.release();
              throw err;
            })
        ))
        .catch((err) => {
          logToConsoleOrSentry(err);
        });
    },
  },

  Query: {
    summary: () => [],

    articleDetail: (root, { canonical, startDate, endDate }) => {
      const values = [canonical, startDate, endDate];
      const text = `
        SELECT canonical, COUNT(*) AS total
        FROM ${TABLE}
        WHERE (canonical = $1) AND (visited_at BETWEEN $2 AND $3)
        GROUP BY canonical
        ORDER BY COUNT(*) DESC
      `;

      return db.connect()
        .then(client => (
          client.query({ text, values })
            .then(({ rows }) => {
              client.release();
              let totalViews;

              if (rows.length === 0) {
                totalViews = 0;
              } else {
                totalViews = rows[0].total;
              }

              return { totalViews, canonical };
            })
            .catch((err) => {
              client.release();
              throw err;
            })
        ))
        .catch((err) => {
          logToConsoleOrSentry(err);
        });
    },

    reprinterDetail: (root, { domain, startDate, endDate }) => {
      const tempValues = [startDate, endDate];
      const queryValues = [domain];
      const tempTable = 'temp2';
      const tempText = `
        CREATE TEMPORARY TABLE IF NOT EXISTS ${tempTable} AS
        (
          SELECT (regexp_matches(url, '${DOMAIN_REGEX}'))[1] as domain, canonical
          FROM ${TABLE}
          WHERE visited_at BETWEEN $1 AND $2
          GROUP BY domain, canonical
        )
      `;
      const queryText = `
        SELECT COUNT(*) AS total
        FROM ${tempTable}
        WHERE domain = $1
        ORDER BY COUNT(*) DESC
      `;
      const deleteQuery = `
        DROP TABLE ${tempTable}
      `;

      return db.connect()
        .then(client => (
          client.query({ text: tempText, values: tempValues })
            .then(() => (
              client.query({ text: queryText, values: queryValues })
                .then(({ rows }) => (
                  client.query(deleteQuery)
                    .then(() => {
                      client.release();
                      let totalReprints;

                      if (rows.length === 0) {
                        totalReprints = 0;
                      } else {
                        totalReprints = rows[0].total;
                      }

                      return { totalReprints, domain };
                    })
                    .catch((err) => {
                      client.release();
                      throw err;
                    })
                ))
                .catch((err) => {
                  client.release();
                  throw err;
                })
            ))
            .catch((err) => {
              client.release();
              throw err;
            })
        ))
        .catch((err) => {
          logToConsoleOrSentry(err);
        });
    },
  },
};

module.exports = resolvers;
