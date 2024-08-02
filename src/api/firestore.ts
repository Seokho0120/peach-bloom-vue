import type { ItemsListType, uploadItemType } from '@/types/items.types';
import firebaseApp from './firebasedb';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  QueryConstraint,
  where,
} from 'firebase/firestore';
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

export async function getItemsList(category: string, filter: string) {
  const baseQuery = collection(db, 'items');

  const categoryConstraint = category !== 'all' && category ? where('categoryName', '==', category) : null; // 카테고리 필드 이름 수정

  const filterOrderBy =
    filter === 'recommend'
      ? orderBy('heartCount', 'desc') // 추천순
      : filter === 'new'
        ? orderBy('isNew', 'desc') // 신상품순
        : filter === 'review'
          ? orderBy('reviewCount', 'desc') // 리뷰많은순
          : filter === 'lowPrice'
            ? orderBy('salePrice') // 낮은가격순
            : filter === 'highPrice'
              ? orderBy('salePrice', 'desc') // 높은가격순
              : filter === 'discount'
                ? orderBy('saleRate', 'desc') // 높은할인순
                : filter === 'like'
                  ? orderBy('heartCount', 'desc') // 좋아요많은순
                  : orderBy('reviewCount'); // 기본 정렬

  const queries: QueryConstraint[] = [categoryConstraint, filterOrderBy, limit(8)].filter(
    (query) => query !== null,
  ) as QueryConstraint[]; // null값 제거

  const productQuery = query(baseQuery, ...queries);
  const snapshot = await getDocs(productQuery);

  console.log(
    '데이터:',
    snapshot.docs.map((doc) => doc.data()),
  );

  const lastDoc = snapshot.docs[snapshot.docs.length - 1];

  return {
    products: snapshot.docs.map((doc) => doc.data()),
    lastDoc,
  };
}

export function getMainItemsList() {
  return getDocs(collection(db, 'mainItems')).then((snapshot) =>
    snapshot.empty ? [] : (snapshot.docs.map((doc) => doc.data()) as ItemsListType[]),
  );
}
