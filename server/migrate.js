require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./db');

const env = process.env.NODE_ENV || 'development';

async function migrate() {
  console.log(`Running migrations (${env} mode, PostgreSQL)...\n`);

  const migrationsTableSql = `CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )`;

  await db.execute(migrationsTableSql);

  let executed = [];
  try {
    const result = await db.query('SELECT name FROM migrations');
    executed = result.rows || [];
  } catch (err) {
    executed = [];
  }
  const executedNames = new Set(executed.map(r => r.name));

  const migrationsDir = path.join(__dirname, 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql') && !f.includes('.sqlite'))
    .sort();

  for (const file of migrationFiles) {
    if (executedNames.has(file)) {
      console.log(`  [skip] ${file} (already executed)`);
      continue;
    }

    console.log(`  [run]  ${file}`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

    try {
      await db.migrate(sql);
      await db.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
      console.log(`         Done.`);
    } catch (err) {
      console.error(`         Error: ${err.message}`);
      process.exit(1);
    }
  }

  console.log('\nMigrations complete.');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
