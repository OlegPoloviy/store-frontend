"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";

function formatSummaryPrice(amount: number) {
  return amount.toLocaleString();
}

export function CheckoutCard({
  subtotal,
  shipping,
  generalPrice,
}: {
  subtotal: number;
  shipping: number;
  generalPrice: number;
}) {
  const [doorCheck, setDoorCheck] = useState(false);

  if (subtotal === 0) {
    return (
      <Card className="overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-0 shadow-[0_18px_50px_rgba(84,72,57,0.08)] backdrop-blur xl:sticky xl:top-28">
        <CardHeader className="border-b border-stone-100 px-6 py-6">
          <CardTitle className="text-2xl font-medium tracking-tight text-stone-950">
            Your order summary
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center px-6 py-10 text-center sm:py-12">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f3eee7] text-stone-900 shadow-sm sm:h-16 sm:w-16">
            <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <h3 className="mt-5 text-xl font-medium tracking-tight text-stone-950 sm:mt-6">
            Your cart is empty
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-stone-500">
            Add some items to your cart to see the full checkout summary.
          </p>

          <Button
            asChild
            className="group mt-6 h-12 w-full max-w-[220px] rounded-full bg-stone-950 px-5 text-white hover:bg-stone-800 sm:mt-7 sm:max-w-sm"
          >
            <Link href="/products">
              Browse products
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </Button>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-stone-400">
            <ShieldCheck size={12} /> Safe payment using Stripe
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-0 shadow-[0_18px_50px_rgba(84,72,57,0.08)] backdrop-blur xl:sticky xl:top-28">
      <CardHeader className="border-b border-stone-100 px-6 py-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-stone-400">
          Checkout
        </p>
        <CardTitle className="text-2xl font-medium tracking-tight text-stone-950">
          Your order summary
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col px-6 py-6">
        <div className="mb-6 space-y-4 border-b border-stone-100 pb-6 text-sm text-stone-600">
          <div className="flex items-center justify-between gap-4">
            <span>Products price</span>
            <span className="font-medium text-stone-950">
              {formatSummaryPrice(subtotal)} USD
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2">
              <Truck className="h-4 w-4 text-stone-400" />
              Delivery (White Glove)
            </span>
            <span className="font-medium text-stone-950">
              {formatSummaryPrice(shipping)} USD
            </span>
          </div>
        </div>
        <div className="mb-8 rounded-[22px] bg-[#f3eee7] p-5">
          <div>
            <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.24em] text-stone-500">
              General price
            </span>
            <span className="text-4xl font-semibold tracking-tight text-stone-950">
              {formatSummaryPrice(generalPrice)} USD
            </span>
          </div>
        </div>
        <div className="mb-6 flex">
          <label className="group flex cursor-pointer items-start gap-3">
            <div
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                doorCheck
                  ? "bg-stone-900 border-stone-900"
                  : "bg-white border-stone-300 group-hover:border-stone-500"
              }`}
            >
              {doorCheck && <CheckCircle2 size={14} className="text-white" />}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={doorCheck}
              onChange={() => setDoorCheck(!doorCheck)}
            />
            <div className="select-none text-sm leading-6 text-stone-500">
              I have checked the width of my doors and passageways. I understand
              that bulky furniture (sofas) may not fit through a standard
              doorway (less than 80 cm).
            </div>
          </label>
        </div>
        <Button
          disabled={!doorCheck}
          className="group mx-auto h-12 w-full rounded-full bg-stone-950 px-5 text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check out
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Button>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-400">
          <ShieldCheck size={12} /> Safe payment using Stripe
        </div>
      </CardContent>
    </Card>
  );
}
