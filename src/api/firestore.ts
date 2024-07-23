import type { ItemsListType, postItemType } from '@/types/items.types';
import firebaseApp from './firebasedb';
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import type { GetProductCategoryType } from '@/types/productCategory.types';

export const db = getFirestore(firebaseApp);

export async function getCategoryList() {
  try {
    const snapShot = await getDocs(collection(db, 'categoryList'));

    if (snapShot.empty) {
      return [];
    } else {
      return snapShot.docs.flatMap((doc) => doc.data()) as GetProductCategoryType[];
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
      return snapShot.docs.flatMap((doc) => doc.data()) as GetProductCategoryType[];
    }
  } catch (error) {
    console.log('error', error);
    return [];
  }
}

export async function postItem({ item, imageUrl }: postItemType) {
  try {
    await addDoc(collection(db, 'items'), {
      ...item,
      imageUrl,
    });
  } catch (error) {
    console.log('postItem API error', error);
  }
}

export async function postMainItem({ item, imageUrl }: postItemType) {
  try {
    await addDoc(collection(db, 'mainItems'), {
      ...item,
      imageUrl,
    });
  } catch (error) {
    console.log('postMainItem API error', error);
  }
}

export function getAllItemsList() {
  return getDocs(collection(db, 'items')).then((snapshot) =>
    snapshot.empty ? [] : (snapshot.docs.map((doc) => doc.data()) as ItemsListType[]),
  );
}
