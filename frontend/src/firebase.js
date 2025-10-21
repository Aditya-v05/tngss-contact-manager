import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions"; // --- NEW ---

const firebaseConfig = {
  apiKey: "AIzaSyDUB6weopXDtsLJtxXyoDsrNZzJdaLWcDo",
  authDomain: "tngss-contact-manager.firebaseapp.com",
  projectId: "tngss-contact-manager",
  storageBucket: "tngss-contact-manager.firebasestorage.app",
  messagingSenderId: "666403870893",
  appId: "1:666403870893:web:a7d98f418793439316ce24",
  measurementId: "G-5E5G28XSKF"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// --- NEW: Initialize and export functions ---
const functions = getFunctions(app);

// --- NEW: Create a callable function reference ---
export const askChatbot = httpsCallable(functions, 'askChatbot');