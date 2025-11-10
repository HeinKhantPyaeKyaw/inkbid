import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAwsP5BA0yf3hWGKck57iyb-oAMu-ma8Q",
  authDomain: "inkbid-95cc3.firebaseapp.com",
  projectId: "inkbid-95cc3",
  storageBucket: "inkbid-95cc3.firebasestorage.app",
  messagingSenderId: "636600337881",
  appId: "1:636600337881:web:9c8e03229701ef6d4945c8",
  measurementId: "G-1XMTW9MCC1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
