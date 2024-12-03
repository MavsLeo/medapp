import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBru30cnhERZUj0FByaU6FjT0aOTav9pLk",
  authDomain: "medapp-4cca2.firebaseapp.com",
  projectId: "medapp-4cca2",
  storageBucket: "medapp-4cca2.firebasestorage.app",
  messagingSenderId: "846443970623",
  appId: "1:846443970623:web:70ed4a1a5cee9fd3ba788a",
  measurementId: "G-YSEHKGL1TW",
  // ... outros detalhes de configuração
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
