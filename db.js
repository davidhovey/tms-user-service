const { Pool } = require('pg');
require('dotenv').config(); // Make sure this is at the top

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
