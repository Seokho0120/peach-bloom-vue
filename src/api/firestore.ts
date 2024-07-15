import type { addItemType } from '@/types/items.types';
import firebaseApp from './firebasedb';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';

export const db = getFirestore(firebaseApp);

export async function getCategoryList() {
  try {
    const snapShot = await getDocs(collection(db, 'categoryList'));

    if (snapShot.empty) {
      return [];
    } else {
      return snapShot.docs.flatMap((doc) => doc.data());
    }
  } catch (error) {
    console.log('error', error);
    return [];
  }
}

export async function getBrandList() {
  try {
    const snapShot = await getDocs(collection(db, 'brandList'));

    if (snapShot.empty) {
      return [];
    } else {
      return snapShot.docs.flatMap((doc) => doc.data());
    }
  } catch (error) {
    console.log('error', error);
    return [];
  }
}

export async function addItem({ item, imageUrl }: addItemType) {
  try {
    await addDoc(collection(db, 'items'), {
      ...item,
      imageUrl,
    });
  } catch (error) {
    console.log('error', error);
  }
}
