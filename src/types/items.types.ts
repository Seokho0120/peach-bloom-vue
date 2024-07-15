export interface ItemsType {
  productDescription: string;
  productName: string;
  brandName: string;
  categoryName: string;
  sellingType: Array<string>;
  breadth: number;
  length: number;
  weight: number;
  width: number;
  consumerPrice: number;
  isSale: boolean;
  salePrice: number;
  saleRate: number;
}

export interface addItemType {
  item: ItemsType;
  imageUrl: string;
}
