import type { Timestamp } from 'firebase/firestore';

export interface ItemsType {
  productId: string;
  productDescription: string;
  productName: string;
  brandName: string;
  categoryName: string;
  sellingType: string[];
  breadth: number;
  length: number;
  weight: number;
  width: number;
  consumerPrice: number;
  isSale: boolean;
  salePrice: number;
  saleRate: number;
  reviewCount: number;
  heartCount: number;
  heartOn: boolean;
  isNew: boolean;
  isSoldOut: boolean;
}

export interface uploadItemType {
  item: ItemsType;
  imageUrl: string[];
}

export interface ItemsListType extends ItemsType {
  imageUrl: string[];
}

export type ImageType = Pick<uploadItemType, 'imageUrl'>;

export interface ItemDetailType extends ItemsListType {
  howToUse?: string;
  ingredients?: string;
}

// Firestore Timestamp 형식
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

// CartItemType 정의
export interface CartItemType {
  breadth: number;
  heartCount: number;
  quantity: number;
  width: number;
  imageUrl: string[];
  weight: number;
  consumerPrice: number;
  reviewCount: number;
  createdAt: FirestoreTimestamp;
  length: number;
  productDescription: string;
  isSoldOut: boolean;
  categoryName: string;
  productName: string;
  heartOn: boolean;
  sellingType: string[];
  productId: string;
  salePrice: number;
  brandName: string;
  isSale: boolean;
  saleRate: number;
  isNew: boolean;
  ingredients?: string; // 선택적 속성
  howToUse?: string; // 선택적 속성
}

// CartItemListType 정의
export interface CartItemListType {
  userId: string;
  items: CartItemType[];
}

// export interface FirestoreTimestamp {
//   seconds: number;
//   nanoseconds: number;
// }

// export interface CartItemType extends ItemDetailType {
//   quantity: number;
//   createdAt: FirestoreTimestamp;
// }

// export interface CartItemListType {
//   items: CartItemType[];
//   userId: string;
// }
