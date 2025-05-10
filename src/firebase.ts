// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAv27IVGiuYWxvQqEi_MjBFAvQ-1eXAtng",
  authDomain: "daywise-ai-3xnsd.firebaseapp.com",
  projectId: "daywise-ai-3xnsd",
  storageBucket: "daywise-ai-3xnsd.appspot.com",
  messagingSenderId: "141558818000",
  appId: "1:141558818000:web:6cdb3deceff23d391aead5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
