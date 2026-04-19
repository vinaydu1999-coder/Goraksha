# Firebase Setup Guide

Follow these steps to connect the app to Firebase.

---

## Step 1 — Create a Firebase project

1. Go to https://console.firebase.google.com
2. Click **Add project** → name it `abvp-prant` → Continue
3. Disable Google Analytics (optional) → **Create project**

---

## Step 2 — Create Firestore database

1. In the left sidebar: **Build → Firestore Database**
2. Click **Create database**
3. Select **Start in test mode** → Next
4. Choose a region (e.g. `asia-south1` for India) → **Enable**

---

## Step 3 — Register a Web App

1. On the project home page, click the **</>** (Web) icon
2. App nickname: `abvp-prant-web` → **Register app**
3. Copy the `firebaseConfig` object shown — it looks like:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "abvp-prant.firebaseapp.com",
  projectId: "abvp-prant",
  storageBucket: "abvp-prant.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123...",
};
```

---

## Step 4 — Paste config into the app

Open the file `src/lib/firebase.ts` and replace the placeholder values:

```ts
const firebaseConfig = {
  apiKey:            "AIza...",          // ← paste your values here
  authDomain:        "abvp-prant.firebaseapp.com",
  projectId:         "abvp-prant",
  storageBucket:     "abvp-prant.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123...",
};
```

---

## Step 5 — Run the app

```bash
npm install
npm run dev
```

Open http://localhost:8080

On first load, the app will **automatically seed** Firestore with all default
institutions, members, meetings, and events.

---

## Default Login Credentials

| Role   | Login ID          | Security Key |
|--------|-------------------|--------------|
| Admin  | admin_ADMIN001    | Admin@123    |
| Member | ramkumar_PR001    | xK9mP2qR     |

---

## Deploy to Firebase Hosting (optional)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # set public dir to "dist", SPA: yes
npm run build
firebase deploy
```
