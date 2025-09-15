// db.js
require('dotenv').config();
const postgres = require('postgres');

const sql = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false }, // Neon usually requires SSL
  max: 10,
  idle_timeout: 10,
  prepare: false // ⚡ Disable cached query plans
});

module.exports = sql;
