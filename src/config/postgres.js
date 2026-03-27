// src/config/postgres.js - Centralized PostgreSQL connection.

const { Pool } = require('pg');

const pool = new Pool({
  user: 'newuser',
  host: 'localhost',
  database: 'farmguardian_db_v2',
  password: 'newpassword',
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
