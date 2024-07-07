import firebaseApp from './firebasedb';
import { getFirestore } from 'firebase/firestore';

export const db = getFirestore(firebaseApp);
