const { createClient } = require('@libsql/client');
const path = require('path');

const serverDir = path.resolve(__dirname, '..');
const dbUrl = process.env.TURSO_DATABASE_URL || 'file:local.db';
const resolvedUrl = dbUrl.startsWith('file:') && !dbUrl.startsWith('file:/')
  ? `file:${path.join(serverDir, dbUrl.replace('file:', ''))}`
  : dbUrl;

const client = createClient({
  url: resolvedUrl,
  authToken: process.env.TURSO_AUTH_TOKEN
});

module.exports = {
  async query(sql, params = []) {
    const tursoParams = params.map((p, i) => [`$${i + 1}`, p]);
    const paramObj = Object.fromEntries(tursoParams);

    let tursoSql = sql;
    params.forEach((_, i) => {
      tursoSql = tursoSql.replace(`$${i + 1}`, `?${i + 1}`);
    });

    const result = await client.execute({
      sql: tursoSql,
      args: params
    });

    return {
      rows: result.rows,
      rowCount: result.rowsAffected
    };
  },

  async execute(sql) {
    return client.execute(sql);
  },

  async migrate(sql) {
    const lines = sql.split('\n');
    let currentStatement = '';
    const statements = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('--') || trimmed === '') continue;
      currentStatement += ' ' + trimmed;
      if (trimmed.endsWith(';')) {
        statements.push(currentStatement.trim().slice(0, -1));
        currentStatement = '';
      }
    }

    for (const statement of statements) {
      if (statement.length > 0) {
        await client.execute(statement);
      }
    }
  },

  client
};
