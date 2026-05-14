// =========================================
// FIREBASE CONFIGURATION FILE
// Hostel Management System
// =========================================

// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =========================================
// FIREBASE CONFIGURATION
// Replace these values with your Firebase project configuration
// =========================================

const firebaseConfig = {
    apiKey: "AIzaSyB3r7ZuFtnbnKPpleJeFWdH5JfcdBuy-8g",
  authDomain: "hostel-management-d5321.firebaseapp.com",
  projectId: "hostel-management-d5321",
  storageBucket: "hostel-management-d5321.firebasestorage.app",
  messagingSenderId: "62188989524",
  appId: "1:62188989524:web:8ffbe7fe148853f41051c1"
};

// =========================================
// INITIALIZE FIREBASE
// =========================================

const app = initializeApp(firebaseConfig);

// =========================================
// INITIALIZE FIREBASE SERVICES
// =========================================

const auth = getAuth(app);
const db = getFirestore(app);

// =========================================
// EXPORT SERVICES
// =========================================

export {
    auth,
    db
};

// =========================================
// SUCCESS MESSAGE
// =========================================

console.log("Firebase Initialized Successfully");
