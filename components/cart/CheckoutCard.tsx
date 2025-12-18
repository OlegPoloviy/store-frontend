"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

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

  return (
    <Card className="w-[40%] h-full">
      <CardHeader>
        <CardTitle>Your order summary</CardTitle>
      </CardHeader>

      <CardContent className="h-full flex flex-col">
        <div className="space-y-3 text-sm text-stone-600 mb-6 border-b border-stone-100 pb-6">
          <div className="flex justify-between">
            <span>Products price</span>
            <span>{subtotal} USD</span>
          </div>
          <div className="flex justify-between">
            <span>Доставка (White Glove)</span>
            <span>{shipping.toLocaleString()} USD</span>
          </div>
        </div>
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="block text-sm text-stone-500 mb-1">
              General price
            </span>
            <span className="text-3xl font-serif font-bold text-stone-900">
              {generalPrice.toLocaleString()} USD
            </span>
          </div>
        </div>
        <div className="mb-6 flex ">
          <label className="flex items-center gap-3 cursor-pointer group text-center">
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
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
            <div className="text-xs text-stone-600 select-none">
              I have checked the width of my doors and passageways. I understand
              that bulky furniture (sofas) may not fit through a standard
              doorway (less than 80 cm).
            </div>
          </label>
        </div>
        <Button
          disabled={!doorCheck}
          className="mt-auto mx-auto w-full bg-stone-900 text-white py-4 rounded-lg font-medium hover:bg-stone-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
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
