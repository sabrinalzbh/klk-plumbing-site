// Firebase client SDK initialization.
//
// All config values are read from NEXT_PUBLIC_* environment variables so the
// same build can be pointed at different Firebase projects (dev/staging/prod)
// without code changes. See .env.local.example for the full list of keys and
// README.md for step-by-step Firebase project setup instructions.
//
// This file is safe to import from both client and server components — it
// only ever runs the client SDK, and getApps() guards against re-initializing
// during Next.js hot-reload / multiple imports.

import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Whether Firebase env vars have actually been configured. Used elsewhere
// (e.g. lib/gallery.ts, ContactForm) to gracefully fall back to placeholder
// UI instead of throwing when the project hasn't been wired up yet.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Firestore and Storage instances. Calling these when Firebase isn't
// configured will not throw at import time, but reads/writes will fail —
// callers should check `isFirebaseConfigured` first (see lib/gallery.ts and
// components/ContactForm.tsx for the pattern).
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
