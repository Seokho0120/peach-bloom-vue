import firebaseApp from './firebasedb';
import type {
  CartItemListType,
  CartItemType,
  DeleteCartItemType,
  FirestoreTimestamp,
  ItemsListType,
  uploadItemType,
} from '@/types/items.types';
import type { GetProductCategoryType } from '@/types/productCategory.types';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
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
  const itemListSnapshot = await getDocs(itemListQuery);
  const itemListData = itemListSnapshot.docs.map((doc) => doc.data());

  const itemDetailQuery = query(collection(db, 'itemsDetail'), where('productId', '==', productId));
  const itemDetailSnapshot = await getDocs(itemDetailQuery);
  const itemsDetailDocs = itemDetailSnapshot.docs.map((doc) => doc.data());
  const itemsDetailData = itemsDetailDocs[0];

  const mergedData = {
    ...itemListData[0],
    ...itemsDetailData,
  };

  const parsed = itemDetailSchema.safeParse(mergedData);
  if (!parsed.success) {
    console.error('parsing error', parsed.error);
    return null;
  }

  return parsed.data;
}

export async function postCartItem(cartItem: CartItemType, userId: string, date: any) {
  const userCartRef = doc(db, 'itemsCart', userId);
  const userCartSnap = await getDoc(userCartRef);

  if (userCartSnap.exists()) {
    const items = userCartSnap.data().items || [];
    const existingItem = items.find((item: CartItemType) => item.productId === cartItem.productId);

    if (existingItem) {
      // 이미 존재하는 경우 수량 업데이트
      existingItem.quantity += cartItem.quantity;
      existingItem.createdAt = date;
    } else {
      // 새로운 아이템인 경우 items에 추가
      items.push(cartItem);
    }

    await updateDoc(userCartRef, { items });
  } else {
    // 해당 유저의 cartItems가 없으면, 필드 새로 생성
    await setDoc(userCartRef, { userId: userId, items: [cartItem] });
  }
}

export function getCartItemList(): Promise<CartItemListType> {
  return getDocs(collection(db, 'itemsCart')).then((snapshot) => {
    const items: CartItemListType[] = [];

    if (!snapshot.empty) {
      items.push(
        ...snapshot.docs.map((doc) => ({
          ...(doc.data() as CartItemListType),
        })),
      );
    }

    // 최신순 설정
    const sortedItems = items[0].items.sort((a, b) => {
      return b.createdAt.seconds - a.createdAt.seconds;
    });

    return {
      userId: items[0].userId,
      items: sortedItems,
    };
  });
}

export async function deleteCartItem({ userId, productId }: DeleteCartItemType) {
  const userCartRef = doc(db, 'itemsCart', userId);
  const userCartSnap = await getDoc(userCartRef);

  if (!userCartSnap.exists()) {
    throw new Error('카트에 제품이 존재하지 않아요 🚨');
  }

  const items = userCartSnap.data().items;
  const updatedItems = items.filter((item: CartItemType) => item.productId !== productId);

  await updateDoc(userCartRef, {
    items: updatedItems,
  });
}
