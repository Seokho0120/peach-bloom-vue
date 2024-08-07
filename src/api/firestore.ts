import { ref } from 'vue';
import firebaseApp from './firebasedb';
import type { ItemsListType, uploadItemType } from '@/types/items.types';
import type { GetProductCategoryType } from '@/types/productCategory.types';
import { addDoc, collection, getDocs, getFirestore, query, where, type DocumentData } from 'firebase/firestore';

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

export async function uploadItem({ item, imageUrl }: uploadItemType) {
  try {
    await addDoc(collection(db, 'items'), {
      ...item,
      imageUrl,
    });
  } catch (error) {
    console.log('uploadItem API error', error);
  }
}

export async function uploadMainItem({ item, imageUrl }: uploadItemType) {
  try {
    await addDoc(collection(db, 'mainItems'), {
      ...item,
      imageUrl,
    });
  } catch (error) {
    console.log('uploadMainItem API error', error);
  }
}
// 필터 x
export function getAllItemsList() {
  return getDocs(collection(db, 'items')).then((snapshot) =>
    snapshot.empty ? [] : (snapshot.docs.map((doc) => doc.data()) as ItemsListType[]),
  );
}

// 정상호출
export async function getItemsList(category: string) {
  const itemQuery = query(collection(db, 'items'), where('categoryName', '==', category));
  const querySnapshot = await getDocs(itemQuery);
  const itemsDetailDocs = querySnapshot.docs.map((doc) => doc.data() as ItemsListType);

  return itemsDetailDocs;
}

export function getMainItemsList() {
  return getDocs(collection(db, 'mainItems')).then((snapshot) =>
    snapshot.empty ? [] : (snapshot.docs.map((doc) => doc.data()) as ItemsListType[]),
  );
}

export async function getItemDetail(productId: string) {
  const itemQuery = query(collection(db, 'itemsDetail'), where('productId', '==', productId));
  const querySnapshot = await getDocs(itemQuery);
  const itemsDetailDocs = querySnapshot.docs.map((doc) => doc.data());
  const itemsDetailData = itemsDetailDocs[0];

  return itemsDetailData;
}
