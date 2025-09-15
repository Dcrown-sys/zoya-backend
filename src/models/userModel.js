const sql = require("../db");

async function createUser({ name, email, phone }) {
  const result = await sql`
    INSERT INTO users (name, email, phone, role, status)
    VALUES (${name}, ${email}, ${phone}, 'user', 'waitlisted')
    RETURNING id, name, email, phone, role, status, created_at;
  `;
  return result[0];
}

async function getAllUsers() {
  return await sql`SELECT id, name, email, phone, role, status, created_at FROM users ORDER BY created_at DESC`;
}

module.exports = { createUser, getAllUsers };
