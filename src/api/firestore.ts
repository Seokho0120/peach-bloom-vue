import { ref } from 'vue';
import firebaseApp from './firebasedb';
import type { CartItemListType, ItemsListType, uploadItemType } from '@/types/items.types';
import type { GetProductCategoryType } from '@/types/productCategory.types';
import { addDoc, collection, getDocs, getFirestore, query, where, type DocumentData } from 'firebase/firestore';
import ItemDetail from '@/views/itemDetail/itemDetail.vue';
import { z } from 'zod';

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



const itemDetailSchema = z.object({
  productId: z.string(),
  productDescription: z.string(),
  productName: z.string(),
  brandName: z.string(),
  categoryName: z.string(),
  sellingType: z.array(z.string()),
  breadth: z.number(),
  length: z.number(),
  weight: z.number(),
  width: z.number(),
  consumerPrice: z.number(),
  isSale: z.boolean(),
  salePrice: z.number(),
  saleRate: z.number(),
  reviewCount: z.number(),
  heartCount: z.number(),
  heartOn: z.boolean(),
  isNew: z.boolean(),
  isSoldOut: z.boolean(),
  imageUrl: z.array(z.string()),
  howToUse: z.string().optional(),
  ingredients: z.string().optional(),
});

export async function getItemDetail(productId: string) {
  const itemListQuery = query(collection(db, 'items'), where('productId', '==', productId));
  const querySnapshot1 = await getDocs(itemListQuery);
  const itemsDetailDocs2 = querySnapshot1.docs.map((doc) => doc.data());

  const itemQuery = query(collection(db, 'itemsDetail'), where('productId', '==', productId));
  const querySnapshot = await getDocs(itemQuery);
  const itemsDetailDocs = querySnapshot.docs.map((doc) => doc.data());
  const itemsDetailData = itemsDetailDocs[0];

  const mergedData = {
    ...itemsDetailDocs2[0],
    ...itemsDetailData,
  }

  const parsed = itemDetailSchema.safeParse(mergedData);
  if (!parsed.success) {
    console.error('parsing error', parsed.error);
    return null
  }

  return parsed.data;
}

export async function postCartItem(cartItem: CartItemListType) {
  const docRef = await addDoc(collection(db, 'itemsCart'), cartItem);

  console.log('docRef???', docRef);
}

export function getCartItemList() {
  return getDocs(collection(db, 'itemsCart')).then((snapshot) =>
    snapshot.empty ? [] : (snapshot.docs.map((doc) => doc.data()) as CartItemListType[]),
  );
}
