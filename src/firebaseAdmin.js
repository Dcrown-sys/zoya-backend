const admin = require("firebase-admin");
const serviceAccount = require("./config/firebaseKey.json"); 
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log("✅ Firebase Admin initialized");

module.exports = admin;
