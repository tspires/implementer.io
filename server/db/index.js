const env = process.env.NODE_ENV || 'development';

let db;

if (env === 'test') {
  db = require('./stub');
} else {
  db = require('./postgres');
}

module.exports = db;
