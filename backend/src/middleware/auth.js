import admin from "firebase-admin";

// Initialize Firebase Admin using env vars
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.PROJECT_ID,
      clientEmail: process.env.CLIENT_EMAIL,
      privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

// Named export 
export async function requireAuth(req, res, next) {
  try {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing bearer token" });

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email || null };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
