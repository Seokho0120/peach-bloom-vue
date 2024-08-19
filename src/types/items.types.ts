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

export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface CartItemType {
  breadth: number;
  heartCount: number;
  quantity: number;
  width: number;
  imageUrl: string[];
  weight: number;
  consumerPrice: number;
  reviewCount: number;

  // TODO: date 타입을 어떻게 해야할지 물어보기
  createdAt: any;
  // createdAt: FirestoreTimestamp;
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
  ingredients?: string;
  howToUse?: string;
}

export interface CartItemListType {
  userId: string;
  items: CartItemType[];
}

export interface DeleteCartItemType {
  userId: string;
  productId: string;
}

//  TODO: 현식님께 물어보기 - 이렇게 하니까 계속 타입 오류 발생했음. extends로 설정하는거랑 뭐가 다른거지?
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
