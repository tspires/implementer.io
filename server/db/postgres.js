const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

module.exports = {
  async query(sql, params = []) {
    return pool.query(sql, params);
  },

  async execute(sql) {
    return pool.query(sql);
  },

  async migrate(sql) {
    await pool.query(sql);
  },

  pool
};
