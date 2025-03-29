// tests/utils/wait-for-postgres.js
const { Pool } = require('pg');

const waitForPostgres = async (retries = 10, delay = 1000) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1');
      await pool.end();
      return true;
    } catch (err) {
      console.log(`[wait-for-postgres] DB not ready yet, retrying... (${i + 1}/${retries})`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  throw new Error('PostgreSQL not available after multiple retries.');
};

module.exports = waitForPostgres;
