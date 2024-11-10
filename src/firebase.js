// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsP42MSKyx0hBYxVkX3R0bwNum95Jkvds",
  authDomain: "triller-pixka.firebaseapp.com",
  projectId: "triller-pixka",
  storageBucket: "triller-pixka.firebasestorage.app",
  messagingSenderId: "1050561654671",
  appId: "1:1050561654671:web:ac3347f913419ae91e25fa",
  measurementId: "G-RGYTNXRR9T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const db = getDatabase(app);

// Export the database instance and functions
export { db, ref, push, onValue };