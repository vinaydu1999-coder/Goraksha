// src/lib/firebase.ts
// ─────────────────────────────────────────────────────────────
// 1. Go to https://console.firebase.google.com
// 2. Create a project → Add Web App
// 3. Copy your firebaseConfig values here
// 4. In Firebase Console: Build → Firestore Database → Create database (start in test mode)
// 5. In Firebase Console: Build → Authentication → Sign-in method → Enable Email/Password
// ─────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);
