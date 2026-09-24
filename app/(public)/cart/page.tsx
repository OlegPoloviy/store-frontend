"use client";
import { useEffect, useState } from "react";
import { cartApi } from "@/api/cart.api";
import axios from "axios";
import { toast } from "sonner";
import { CartItemsList } from "@/components/cart/ProductsCard";
import { CheckoutCard } from "@/components/cart/CheckoutCard";
import { CartItemVM } from "@/types/cart-item.type";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Loader } from "@/components/Loader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        toast.error(axios.isAxiosError(error) ? error.response?.data?.message ?? "Error fetching cart" : "Error fetching cart");
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
      window.dispatchEvent(new Event("cart:updated"));
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuantityChange = async (
    id: string,
    action: "increase" | "decrease"
  ) => {
    if (pendingQty[id]) return;

    const prevItems = cartItems;
    const prevTotal = total;
    const prevShipping = shipping;
    const prevGeneral = generalPrice;

    const item = cartItems.find((x) => x.id === id);
    if (!item) return;

    const currentQty = item.quantity ?? 1;
    if (action === "decrease" && currentQty <= 1) return;

    const delta = action === "increase" ? 1 : -1;

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
      window.dispatchEvent(new Event("cart:updated"));
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#d9d6d1] px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1760px] rounded-[32px] border border-white/60 bg-[#f7f4ef]/88 p-6 shadow-[0_24px_80px_rgba(70,61,50,0.1)] backdrop-blur md:p-8">
          <Loader message="Loading cart..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d9d6d1] px-4 py-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1760px] rounded-[32px] border border-white/60 bg-[#f7f4ef]/88 p-5 shadow-[0_24px_80px_rgba(70,61,50,0.1)] backdrop-blur md:p-8 lg:p-10">
        <div className="mb-8 flex flex-col gap-5 border-b border-stone-200/70 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em] text-stone-500">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Order checkout
            </p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight text-stone-950 sm:text-5xl">
              Review your handcrafted selections
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-500">
              Confirm quantities, delivery details and passageway access before
              moving to secure checkout.
            </p>
          </div>

          <Button
            asChild
            className="h-12 rounded-full bg-stone-950 px-5 text-white hover:bg-stone-800"
          >
            <Link href="/products">
              Continue shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] 2xl:grid-cols-[minmax(0,1fr)_480px]">
          <div className="flex min-w-0 flex-col gap-5">
            <CartItemsList
              pendingItems={pendingQty}
              onRemove={handleDelete}
              onQuantityChange={handleQuantityChange}
              items={cartItems}
            />

            <div className="rounded-[24px] border border-white/70 bg-white/75 p-5 shadow-[0_16px_45px_rgba(84,72,57,0.08)] backdrop-blur">
              <div className="flex gap-4">
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3eee7] text-stone-900">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-stone-950">
                    Guarantee of safe orders
                  </h4>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                    All furniture is insured for its full value. We use special
                    wooden crates for transportation to avoid damage.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <CheckoutCard itemCount={cartItems.length} cartRevision={cartItems.map((item) => `${item.id}:${item.quantity}`).join(",")} />
        </div>
      </div>
    </div>
  );
}
