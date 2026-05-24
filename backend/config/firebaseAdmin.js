const admin = require('firebase-admin')

let db = null

try {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : null

  if (projectId && clientEmail && privateKey) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey
        })
      })
      console.log('✅ Firebase Admin SDK initialized successfully')
    }
    db = admin.firestore()
  } else {
    console.warn('⚠️ Firebase Admin SDK environment variables missing. Firebase Admin works in mock/fallback mode.')
  }
} catch (err) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', err.message)
}

module.exports = { admin, db }
