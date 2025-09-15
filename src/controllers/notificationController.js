const notificationModel = require("../models/notificationModel");
const admin = require("../firebaseAdmin");

async function registerToken(req, res) {
  try {
    const { userId, token } = req.body;
    await notificationModel.saveToken(userId, token);
    res.json({ message: "Token registered" });
  } catch (err) {
    console.error("❌ Token register error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function sendNotification(req, res) {
  try {
    const { token, title, body } = req.body;
    await admin.messaging().send({ token, notification: { title, body } });
    res.json({ message: "Notification sent" });
  } catch (err) {
    console.error("❌ Send notification error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function broadcastNotification(req, res) {
  try {
    const tokens = await notificationModel.getAllTokens();
    const { title, body } = req.body;

    const messages = tokens.map(t => ({
      token: t.device_token,
      notification: { title, body },
    }));

    const batchResponse = await admin.messaging().sendEach(messages);

    res.json({ message: "Broadcast complete", successCount: batchResponse.successCount });
  } catch (err) {
    console.error("❌ Broadcast error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { registerToken, sendNotification, broadcastNotification };
