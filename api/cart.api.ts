import { CartInputType } from "@/types/cart-input.type";
import { CartItemVM } from "@/types/cart-item.type";
import { CartVM } from "@/types/cart.type";
import { Product } from "@/types/product.type";
import { httpClient } from "./httpClient";
import { mapCartItem, toNumber } from "@/lib/util/cartUtil";

export type CartItemApi = {
  id: string;
  productId: string;
  quantity: number;
  priceSnapshot?: string | number | null;
  product?: Partial<Product> | null;
};

function normalizeCartResponse(data: any): CartVM {
  const total = toNumber(data?.total) ?? 0;
  const shippingPrice = toNumber(data?.shippingPrice) ?? 0;
  const generalPrice = toNumber(data?.generalPrice) ?? 0;

  const items: CartItemApi[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
    ? data.items
    : [];

  return {
    items: items.map(mapCartItem),
    total,
    shippingPrice,
    generalPrice,
  };
}

export const cartApi = {
  addToCart: async (body: CartInputType): Promise<any> => {
    const response = await httpClient.post("/cart/items", body);
    return response.data;
  },

  getCart: async (): Promise<CartVM> => {
    const response = await httpClient.get("/cart");
    return normalizeCartResponse(response.data);
  },

  removeFromCart: async (cartItemId: string): Promise<CartVM> => {
    const response = await httpClient.delete(`/cart/items/${cartItemId}`);
    return normalizeCartResponse(response.data);
  },
};
