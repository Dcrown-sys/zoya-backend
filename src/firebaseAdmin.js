console.log("Private key:", process.env.FIREBASE_PRIVATE_KEY.slice(0, 50) + "...");

const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
});

console.log("✅ Firebase Admin initialized");

module.exports = admin;
