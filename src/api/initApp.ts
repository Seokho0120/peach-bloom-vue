import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STOREBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGEINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APIID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID,
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

export { auth, firebaseApp };
