import { CartItemVM } from "@/types/cart-item.type";

export interface CartVM {
  items: CartItemVM[];
  total: number;
  shippingPrice: number;
  generalPrice: number;
}
