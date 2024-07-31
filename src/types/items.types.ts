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
}

export interface uploadItemType {
  item: ItemsType;
  imageUrl: string[];
}

export interface ItemsListType extends ItemsType {
  imageUrl: string[];
}

export type ImageType = Pick<uploadItemType, 'imageUrl'>;
