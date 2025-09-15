// src/models/waitlistModel.js
const sql = require("../db");

// Get all users
async function getAllSignups() {
  return await sql`
    SELECT id, full_name, email, status, created_at
    FROM users WHERE status = 'waitlisted'
    ORDER BY created_at DESC
  `;
}

// Count total users
async function countUsers() {
  const result = await sql`SELECT COUNT(*) FROM users`;
  return Number(result[0].count);
}

// Count only waitlisted users
async function countWaitlist() {
  const result = await sql`
    SELECT COUNT(*) FROM users WHERE status = 'waitlisted'
  `;
  return Number(result[0].count);
}

// Get recent users
async function getRecentSignups(limit = 10) {
  return await sql`
    SELECT id, full_name, email, status, created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
}

module.exports = {
  getAllSignups,
  countUsers,
  countWaitlist,
  getRecentSignups,
};
