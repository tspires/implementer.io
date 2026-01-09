const env = process.env.NODE_ENV || 'development';

let db;

if (env === 'test') {
  db = require('./stub');
} else if (env === 'production') {
  db = require('./postgres');
} else {
  db = require('./turso');
}

module.exports = db;
