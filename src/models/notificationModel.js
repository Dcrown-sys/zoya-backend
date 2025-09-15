const sql = require("../db");

async function saveToken(userId, token) {
  await sql`
    INSERT INTO notification_tokens (user_id, device_token)
    VALUES (${userId}, ${token})
    ON CONFLICT (user_id) DO UPDATE SET device_token = EXCLUDED.device_token
  `;
}

async function getAllTokens() {
  return await sql`SELECT device_token FROM notification_tokens`;
}

module.exports = { saveToken, getAllTokens };
