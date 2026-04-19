# ABVP Goraksha Prant Management Portal

A management portal for ABVP Goraksha Prant built with **React + TypeScript + Vite + Tailwind CSS + Firebase Firestore**.

## Quick Start

1. **Clone & install**
   ```bash
   npm install
   ```

2. **Set up Firebase** — see [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md) for step-by-step instructions

3. **Paste your Firebase config** into `src/lib/firebase.ts`

4. **Run**
   ```bash
   npm run dev
   ```

## Default Login

| Role   | Login ID       | Key       |
|--------|---------------|-----------|
| Admin  | admin_ADMIN001 | Admin@123 |
| Member | ramkumar_PR001 | xK9mP2qR  |

## Features

- Real-time sync via **Firebase Firestore**
- 4-unit hierarchy: Prant → Mahanagar → Nagar → Parisar
- Member management with auto-generated login credentials
- Meetings & Events (online/offline, seminar/rally/camp)
- Institution directory
- Join request flow with admin approve/reject
- Print-to-window & CSV export
- PWA installable on mobile

## Tech Stack

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui · Firebase Firestore · React Router v6
