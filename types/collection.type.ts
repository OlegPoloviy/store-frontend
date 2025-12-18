import { Product } from "./product.type";

export interface Collection {
  id: string;
  userId: string;
  name: string;
  isPrivate: boolean;
  createdAt: Date;
}

export interface CollectionItem {
  id: string;
  collectionId: string;
  productId: string;
  addedAt: string;
  product: Product;
}
