require('dotenv').config();

const { Pool, types } = require('pg');

/*
 * PostgreSQL returns NUMERIC/DECIMAL values as strings.
 * Convert them automatically to JavaScript numbers.
 */
types.setTypeParser(1700, value => parseFloat(value));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  // Required for Amazon RDS / Aurora PostgreSQL
  ssl: {
    rejectUnauthorized: false
  },

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('connect', () => {
  console.log('✅ PostgreSQL client connected');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL Pool Error');
  console.error(err);
});

module.exports = pool;