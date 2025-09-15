const sql = require("../db");

async function createAdmin({ email, password }) {
  const result = await sql`
    INSERT INTO admins (email, password)
    VALUES (${email}, ${password})
    RETURNING id, email, created_at;
  `;
  return result[0];
}

async function findByEmail(email) {
  const result = await sql`SELECT * FROM admins WHERE email = ${email} LIMIT 1`;
  return result[0];
}

module.exports = { createAdmin, findByEmail };
