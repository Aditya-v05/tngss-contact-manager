import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import getAuth

// ... your firebaseConfig ...
const firebaseConfig = { apiKey: "AIzaSyDUB6weopXDtsLJtxXyoDsrNZzJdaLWcDo",
  authDomain: "tngss-contact-manager.firebaseapp.com",
  projectId: "tngss-contact-manager",
  storageBucket: "tngss-contact-manager.firebasestorage.app",
  messagingSenderId: "666403870893",
  appId: "1:666403870893:web:a7d98f418793439316ce24",
  measurementId: "G-5E5G28XSKF"};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize and export services
export const db = getFirestore(app);
export const auth = getAuth(app); // Export auth