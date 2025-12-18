import { Product } from "@/types/product.type";

export interface BoardItem {
  uniqueId: string; // Унікальний ID на дошці
  productId: string;
  x: number;
  y: number;
  product: Product;
  scale?: number;
  rotation?: number;
}
