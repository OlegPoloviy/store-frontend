"use client";
import { useEffect, useState } from "react";
import { cartApi } from "@/api/cart.api";
import { toast } from "sonner";
import { CartItemsList } from "@/components/cart/ProductsCard";
import { CheckoutCard } from "@/components/cart/CheckoutCard";
import { CartItemVM } from "@/types/cart-item.type";
import { ShieldCheck } from "lucide-react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemVM[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(0);
  const [generalPrice, setGeneralPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingQty, setPendingQty] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;

    async function fetchItems() {
      try {
        const cart = await cartApi.getCart();
        if (!isMounted) return;
        setCartItems(cart.items);
        setTotal(cart.total);
        setShipping(cart.shippingPrice);
        setGeneralPrice(cart.generalPrice);
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Error fetching cart");
        if (isMounted) setCartItems([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchItems();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const updatedCart = await cartApi.removeFromCart(id);
      setCartItems(updatedCart.items);
      setTotal(updatedCart.total);
      setShipping(updatedCart.shippingPrice);
      setGeneralPrice(updatedCart.generalPrice);
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuantityChange = async (
    id: string,
    action: "increment" | "decrement"
  ) => {
    if (pendingQty[id]) return;

    const prevItems = cartItems;
    const prevTotal = total;
    const prevShipping = shipping;
    const prevGeneral = generalPrice;

    const item = cartItems.find((x) => x.id === id);
    if (!item) return;

    const currentQty = item.quantity ?? 1;
    if (action === "decrement" && currentQty <= 1) return;

    const delta = action === "increment" ? 1 : -1;

    // Optimistic UI update
    setPendingQty((m) => ({ ...m, [id]: true }));
    setCartItems((items) =>
      items.map((it) =>
        it.id === id ? { ...it, quantity: (it.quantity ?? 1) + delta } : it
      )
    );
    setTotal((t) => t + delta * (item.price ?? 0));
    setGeneralPrice((g) => g + delta * (item.price ?? 0));

    try {
      const updatedCart = await cartApi.updateQuantity(id, action);
      setCartItems(updatedCart.items);
      setTotal(updatedCart.total);
      setShipping(updatedCart.shippingPrice);
      setGeneralPrice(updatedCart.generalPrice);
    } catch (e) {
      // Rollback
      setCartItems(prevItems);
      setTotal(prevTotal);
      setShipping(prevShipping);
      setGeneralPrice(prevGeneral);
      console.error(e);
      toast.error("Failed to update quantity");
    } finally {
      setPendingQty((m) => {
        const next = { ...m };
        delete next[id];
        return next;
      });
    }
  };

  if (isLoading) return <div className="p-6">Loading cart...</div>;

  return (
    <div className="min-h-screen p-6 pt-[4%] flex flex-col">
      <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">
        Order checkout
      </h2>
      <div className="flex-1 flex gap-8 items-stretch">
        <div className="flex flex-col flex-1 min-w-0">
          <CartItemsList
            className="h-[80%]"
            onRemove={handleDelete}
            onQuantityChange={handleQuantityChange}
            items={cartItems}
          />

          <div className="mt-auto bg-stone-100 rounded-xl p-4 border border-stone-200 flex gap-4 items-start">
            <div className="bg-white p-2 rounded-full shadow-sm text-stone-900 mt-1">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">
                Guarantee of safe orders
              </h4>
              <p className="text-xs text-stone-600 mt-1 max-w-md">
                All furniture is insured for its full value. We use special
                wooden crates for transportation (crating) to avoid damage.
              </p>
            </div>
          </div>
        </div>
        <CheckoutCard
          subtotal={total}
          generalPrice={generalPrice}
          shipping={shipping}
        />
      </div>
    </div>
  );
}
