import { CartInputType } from "@/types/cart-input.type";
import { CartVM } from "@/types/cart.type";
import { Product } from "@/types/product.type";
import { storeClient } from "./storeClient";
import { mapCartItem, toNumber } from "@/lib/util/cartUtil";

export type CartItemApi = {
  id: string;
  productId: string;
  quantity: number;
  priceSnapshot?: string | number | null;
  product?: Partial<Product> | null;
};

function normalizeCartResponse(data: unknown): CartVM {
  const cart = (data && typeof data === "object" ? data : {}) as Partial<CartVM> & { items?: CartItemApi[] };
  const total = toNumber(cart.total) ?? 0;
  const shippingPrice = toNumber(cart.shippingPrice) ?? 0;
  const generalPrice = toNumber(cart.generalPrice) ?? 0;

  const items: CartItemApi[] = Array.isArray(data)
    ? data
    : Array.isArray(cart.items)
    ? cart.items
    : [];

  return {
    items: items.map(mapCartItem),
    total,
    shippingPrice,
    generalPrice,
  };
}

export const cartApi = {
  addToCart: async (body: CartInputType): Promise<unknown> => {
    const response = await storeClient.post("/cart/items", body);
    return response.data;
  },

  getCart: async (): Promise<CartVM> => {
    const response = await storeClient.get("/cart");
    return normalizeCartResponse(response.data);
  },

  removeFromCart: async (cartItemId: string): Promise<CartVM> => {
    const response = await storeClient.delete(`/cart/items/${cartItemId}`);
    return normalizeCartResponse(response.data);
  },

  updateQuantity: async (
    cartItemId: string,
    action: "increase" | "decrease"
  ): Promise<CartVM> => {
    const response = await storeClient.patch(
      `/cart/items/${cartItemId}/quantity`,
      { action }
    );

    return normalizeCartResponse(response.data);
  },
};
