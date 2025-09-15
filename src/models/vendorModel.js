// src/models/vendorModel.js
const sql = require("../db");

async function createVendor({ name, email, category }) {
  const result = await sql`
    INSERT INTO vendors (name, email, category, status)
    VALUES (${name}, ${email}, ${category}, 'pending')
    RETURNING id, name, email, category, status, created_at;
  `;
  return result[0];
}

async function getVendors() {
  return await sql`
    SELECT id, name, email, category, status, created_at
    FROM vendors
    ORDER BY created_at DESC
  `;
}

// ✅ New: count total vendors
async function countVendors() {
  const result = await sql`SELECT COUNT(*) FROM vendors`;
  return Number(result[0].count);
}

module.exports = {
  createVendor,
  getVendors,
  countVendors,
};
