import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// const firebaseConfig = {
//   apiKey: import.meta.env.FIREBASE_API_KEY,
//   authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.FIREBASE_STOREBUCKET,
//   messagingSenderId: import.meta.env.FIREBASE_MESSAGEINGSENDERID,
//   appId: import.meta.env.FIREBASE_APIID,
//   measurementId: import.meta.env.FIREBASE_MEASUREMENTID,
// };

const firebaseConfig = {
  apiKey: 'AIzaSyDLwwhSzGE_U5Ee7exVp5ak9PdYFD-HTeg',
  authDomain: 'peachbloom-27ec8.firebaseapp.com',
  projectId: 'peachbloom-27ec8',
  storageBucket: 'peachbloom-27ec8.appspot.com',
  messagingSenderId: '399974555241',
  appId: '1:399974555241:web:d94e5808f90f071f2cccf8',
  measurementId: 'G-SFRSWH0MW7',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export { auth, app };
