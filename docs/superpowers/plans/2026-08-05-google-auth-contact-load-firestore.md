# Google Auth, Contact Import & Cloud Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Firebase Google Sign-In, real-time Cloud Firestore database sync per user UID, Web Contact Picker API / VCF CSV file contact load feature, and strict Firestore Security Rules.

**Architecture:** Firebase Web SDK v10 (`firebase/app`, `firebase/auth`, `firebase/firestore`), Web Contact Picker API, and Firestore Security Rules.

**Tech Stack:** Firebase Auth, Cloud Firestore, Vite, Vanilla JS, Cytoscape.js.

## Global Constraints

- Storage: Cloud Firestore + LocalStorage fallback
- Auth: Google Identity Provider (`GoogleAuthProvider`)
- Security: User-scoped Firestore security rules (`users/{userId}/contacts/{contactId}`)
- Contacts: Native Web Contacts API (`navigator.contacts.select`) + VCF/CSV file parser fallback

---

### Task 1: Firebase Project Configuration & Dependencies Setup

**Files:**
- Modify: `package.json`
- Create: `src/firebase.js`
- Create: `firestore.rules`

- [ ] **Step 1: Add firebase package to package.json**

```json
{
  "dependencies": {
    "cytoscape": "^3.30.0",
    "firebase": "^10.12.0"
  }
}
```

- [ ] **Step 2: Run npm install**

Run: `npm install`
Expected: `firebase` installed cleanly.

- [ ] **Step 3: Create src/firebase.js initialization file**

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDemoConfigKeyForSocialAffinityNetwork",
  authDomain: "social-affinity-network.firebaseapp.com",
  projectId: "social-affinity-network",
  storageBucket: "social-affinity-network.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signOut, onAuthStateChanged, collection, doc, setDoc, deleteDoc, onSnapshot };
```

---

### Task 2: Firebase Google Auth & User Profile Sync

**Files:**
- Modify: `src/main.js`
- Modify: `src/style.css`

- [ ] **Step 1: Add Google Login / Logout UI to Navbar**

Add Google Sign-In button `🔑 Login Google` & User Avatar display in navbar.

- [ ] **Step 2: Connect GoogleAuthProvider in src/main.js**

When user logs in with Google:
- Center node `YOU (Me)` updates with Google Profile Photo & Display Name!
- Listen to `onAuthStateChanged(auth, user => ...)` to switch session states cleanly.

---

### Task 3: Cloud Firestore Sync per User UID

**Files:**
- Modify: `src/storage.js`
- Create: `firestore.rules`

- [ ] **Step 1: Update StorageManager to handle Firestore Realtime Sync**

```javascript
import { db, collection, doc, setDoc, deleteDoc, onSnapshot } from './firebase.js';

export class StorageManager {
  static syncCloudContacts(userId, callback) {
    if (!userId) return null;
    const contactsRef = collection(db, 'users', userId, 'contacts');
    return onSnapshot(contactsRef, (snapshot) => {
      const contacts = [];
      snapshot.forEach(docSnap => {
        contacts.push(docSnap.data());
      });
      callback(contacts);
    });
  }
}
```

- [ ] **Step 2: Create firestore.rules security rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/contacts/{contactId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

### Task 4: Web Contact Picker API & File Contact Import Feature

**Files:**
- Modify: `src/main.js`

- [ ] **Step 1: Implement Contact Load function**

```javascript
async function loadDeviceContacts() {
  if ('contacts' in navigator && 'Select' in window.ContactsManager) {
    try {
      const props = ['name', 'tel', 'email'];
      const contacts = await navigator.contacts.select(props, { multiple: true });
      return contacts;
    } catch (err) {
      console.warn('Contact picker cancelled or unallowed:', err);
    }
  }
  // Fallback file picker trigger
  document.getElementById('vcfInput').click();
}
```

- [ ] **Step 2: Implement CSV/VCF parser for file import**

Parse imported VCF/CSV files and auto-add contacts into user's Dunbar concentric social network!

---

### Task 5: Security Review & Verification

- [ ] **Step 1: Audit code with Security Review Checklist**
- [ ] **Step 2: Run npx vite build to verify 0 build errors**
- [ ] **Step 3: Deploy to Vercel**
