"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { checkoutApi, CheckoutOrder, CheckoutQuote, PaymentInstruction, ShippingDetails } from "@/api/checkout.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

const ORDER_KEY = "checkout_order_id";
const IDEMPOTENCY_KEY = "checkout_idempotency_key";
const MOCK_ORDER_KEY = "checkout_mock_order_id";
const initialDetails: ShippingDetails = {
  customerEmail: "", customerFirstName: "", customerLastName: "", customerPhone: "",
  shippingCountry: "", shippingAddress: "", shippingCity: "", shippingRegion: "", shippingPostalCode: "",
};

function countryCode(value: unknown): string {
  if (typeof value !== "string") return "";
  const country = value.trim();
  if (/^[a-z]{2}$/i.test(country)) return country.toUpperCase();
  const names: Record<string, string> = {
    germany: "DE", deutschland: "DE", ukraine: "UA", україна: "UA",
    poland: "PL", польща: "PL", france: "FR", франція: "FR",
    "united states": "US", usa: "US", "united kingdom": "GB", uk: "GB",
  };
  return names[country.toLowerCase()] ?? "";
}

function profileValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function amount(minor: number | undefined, currency: string) {
  return typeof minor === "number" ? new Intl.NumberFormat("en", { style: "currency", currency }).format(minor / 100) : "—";
}

function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) return error.response?.data?.message ?? error.message;
  return error instanceof Error ? error.message : "Request failed";
}

function submitHostedPayment(payment: PaymentInstruction) {
  const target = new URL(payment.action);
  if (target.protocol !== "https:" || payment.method.toUpperCase() !== "POST") throw new Error("Invalid payment destination");
  const form = document.createElement("form");
  form.method = "POST";
  form.action = target.toString();
  for (const [name, value] of Object.entries(payment.fields)) {
    for (const entry of Array.isArray(value) ? value : [value]) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = Array.isArray(value) && !name.endsWith("[]") ? `${name}[]` : name;
      input.value = String(entry);
      form.append(input);
    }
  }
  document.body.append(form);
  form.submit();
}

export function CheckoutCard({ itemCount, cartRevision }: { itemCount: number; cartRevision: string }) {
  const [details, setDetails] = useState<ShippingDetails>(initialDetails);
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [order, setOrder] = useState<CheckoutOrder | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [doorCheck, setDoorCheck] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [editAllDetails, setEditAllDetails] = useState(false);
  const editedFields = useRef(new Set<keyof ShippingDetails>());

  useEffect(() => {
    let active = true;
    getCurrentUser().then((user) => {
      if (!active || !user) return;
      const metadata = user.user_metadata ?? {};
      const saved: Partial<ShippingDetails> = {
        customerEmail: profileValue(user.email),
        customerFirstName: profileValue(metadata.firstName),
        customerLastName: profileValue(metadata.lastName),
        customerPhone: profileValue(metadata.phone),
        shippingCountry: countryCode(metadata.country),
        shippingAddress: profileValue(metadata.address),
        shippingCity: profileValue(metadata.city),
        shippingRegion: profileValue(metadata.region),
        shippingPostalCode: profileValue(metadata.postalCode),
      };
      setDetails((current) => {
        const next = { ...current };
        for (const key of Object.keys(saved) as (keyof ShippingDetails)[]) {
          if (!editedFields.current.has(key) && saved[key]) next[key] = saved[key];
        }
        return next;
      });
    }).catch(() => undefined).finally(() => { if (active) setProfileLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const id = window.sessionStorage.getItem(ORDER_KEY);
    if (id) checkoutApi.order(id).then((result) => {
      if (window.sessionStorage.getItem(MOCK_ORDER_KEY) === id && !result.payment) {
        result.payment = { provider: "mock", action: "", method: "POST", fields: {} };
      }
      setOrder(result);
    }).catch(() => window.sessionStorage.removeItem(ORDER_KEY));
  }, []);

  useEffect(() => {
    if (!itemCount || order || profileLoading || !/^[A-Z]{2}$/.test(details.shippingCountry)) {
      setQuote(null);
      return;
    }
    let active = true;
    checkoutApi.quote(details.shippingCountry).then((result) => {
      if (active) { setQuote(result); setError(""); }
    }).catch((cause) => { if (active) { setQuote(null); setError(errorMessage(cause)); } });
    return () => { active = false; };
  }, [details.shippingCountry, itemCount, cartRevision, order, profileLoading]);

  useEffect(() => {
    if (!order?.orderId || order.status === "PAID" || order.status === "FAILED") return;
    const timer = window.setInterval(() => {
      checkoutApi.order(order.orderId).then((result) => setOrder((previous) => ({ ...previous, ...result, payment: result.payment ?? previous?.payment }))).catch(() => undefined);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [order?.orderId, order?.status]);

  async function createOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!doorCheck || !quote || profileLoading || fields.some(({ key }) => !details[key].trim()) || !/^[A-Z]{2}$/.test(details.shippingCountry)) return;
    setBusy(true); setError("");
    const key = window.sessionStorage.getItem(IDEMPOTENCY_KEY) ?? crypto.randomUUID();
    window.sessionStorage.setItem(IDEMPOTENCY_KEY, key);
    try {
      const result = await checkoutApi.create(details, key);
      window.sessionStorage.setItem(ORDER_KEY, result.orderId);
      if (result.payment?.provider === "mock") window.sessionStorage.setItem(MOCK_ORDER_KEY, result.orderId);
      window.sessionStorage.removeItem(IDEMPOTENCY_KEY);
      setOrder(result);
    } catch (cause) { setError(errorMessage(cause)); }
    finally { setBusy(false); }
  }

  async function mockPayment(outcome: "approved" | "declined") {
    if (!order) return;
    setBusy(true); setError("");
    try {
      await checkoutApi.mockPayment(order.orderId, outcome);
      const result = await checkoutApi.order(order.orderId);
      setOrder((previous) => ({ ...previous, ...result, payment: result.payment ?? previous?.payment }));
    } catch (cause) { setError(errorMessage(cause)); }
    finally { setBusy(false); }
  }

  async function retry() {
    if (!order) return;
    setBusy(true); setError("");
    try {
      const attempt = await checkoutApi.retry(order.orderId);
      setOrder({ ...order, ...attempt, orderId: order.orderId, status: "PENDING", payment: attempt.payment ?? order.payment });
    }
    catch (cause) { setError(errorMessage(cause)); }
    finally { setBusy(false); }
  }

  const currency = order?.currency ?? quote?.currency ?? "UAH";
  const productsMinor = quote?.itemsTotalMinor ?? (typeof quote?.totalMinor === "number" && typeof quote?.shippingMinor === "number" ? quote.totalMinor - quote.shippingMinor : undefined);
  const fields: { key: keyof ShippingDetails; label: string; type?: string }[] = [
    { key: "customerEmail", label: "Email", type: "email" },
    { key: "customerFirstName", label: "First name" },
    { key: "customerLastName", label: "Last name" },
    { key: "customerPhone", label: "Phone", type: "tel" },
    { key: "shippingCountry", label: "Country code (e.g. DE)" },
    { key: "shippingAddress", label: "Street address" },
    { key: "shippingCity", label: "City" },
    { key: "shippingRegion", label: "Region" },
    { key: "shippingPostalCode", label: "Postal code" },
  ];
  const missingFields = fields.filter(({ key }) => !details[key].trim());
  const visibleFields = editAllDetails ? fields : fields.filter(({ key }) => !details[key].trim() || editedFields.current.has(key));

  return <Card className="h-fit rounded-[28px] border border-white/70 bg-white/85 shadow-lg xl:sticky xl:top-28">
    <CardHeader><CardTitle className="text-2xl">Checkout</CardTitle></CardHeader>
    <CardContent className="space-y-5">
      {order ? <div className="space-y-4" aria-live="polite">
        <p>Order <strong>{order.orderId}</strong></p>
        <p>Status: <strong>{order.status ?? "PENDING"}</strong></p>
        {order.status === "PAID" ? <><p className="text-green-700">Payment confirmed. Thank you for your order.</p><Button variant="outline" onClick={() => { window.sessionStorage.removeItem(ORDER_KEY); window.sessionStorage.removeItem(MOCK_ORDER_KEY); setOrder(null); }}>Start a new order</Button></> : null}
        {order.status === "FAILED" ? <><p className="text-red-700">Payment failed.</p><Button onClick={retry} disabled={busy}>Retry payment</Button></> : null}
        {order.status !== "PAID" && order.status !== "FAILED" && order.payment?.provider === "mock" ? <div className="flex flex-wrap gap-2">
          <Button onClick={() => mockPayment("approved")} disabled={busy}>Approve mock payment</Button>
          <Button variant="outline" onClick={() => mockPayment("declined")} disabled={busy}>Decline mock payment</Button>
        </div> : null}
        {order.status !== "PAID" && order.status !== "FAILED" && order.payment && order.payment.provider !== "mock" ?
          <Button onClick={() => { try { submitHostedPayment(order.payment!); } catch (cause) { setError(errorMessage(cause)); } }}>Go to secure payment</Button> : null}
        <p className="text-xs text-stone-500">Payment status is confirmed by the server. This page refreshes it automatically.</p>
      </div> : itemCount === 0 ? <><p>Your cart is empty.</p><Button asChild><Link href="/products">Browse products</Link></Button></> :
      <form onSubmit={createOrder} className="space-y-4">
        <div className="space-y-2 rounded-2xl bg-stone-100 p-4 text-sm">
          <div className="flex justify-between"><span>Products</span><strong>{amount(productsMinor, currency)}</strong></div>
          <div className="flex justify-between"><span>Shipping</span><strong>{amount(quote?.shippingMinor, currency)}</strong></div>
          <div className="flex justify-between border-t border-stone-300 pt-2"><span>Total</span><strong>{amount(quote?.totalMinor, currency)}</strong></div>
        </div>
        <p className="text-xs text-stone-500">Current prices and shipping are calculated by the server.</p>
        {profileLoading ? <p className="text-sm text-stone-500">Loading saved details…</p> : <>
          <div className="rounded-2xl border border-stone-200 p-4 text-sm text-stone-700">
            <div className="flex items-center justify-between gap-3">
              <strong>Contact and delivery details</strong>
              <button type="button" className="text-sm underline" onClick={() => setEditAllDetails((value) => !value)}>{editAllDetails ? "Show only missing" : "Edit details"}</button>
            </div>
            <p className="mt-2 break-words">{[details.customerFirstName, details.customerLastName].filter(Boolean).join(" ") || "Name needed"} · {details.customerEmail || "Email needed"}</p>
            <p className="break-words">{details.customerPhone || "Phone needed"}</p>
            <p className="break-words">{[details.shippingAddress, details.shippingCity, details.shippingRegion, details.shippingPostalCode, details.shippingCountry].filter(Boolean).join(", ") || "Address needed"}</p>
          </div>
          {missingFields.length > 0 && !editAllDetails ? <p className="text-sm text-stone-600">Please add the missing details below.</p> : null}
        </>}
        {!profileLoading && visibleFields.map(({ key, label, type }) => <label key={key} className="block text-sm text-stone-700">{label}
          <input className="mt-1 w-full rounded-lg border border-stone-300 bg-white p-2" required type={type ?? "text"} pattern={key === "shippingCountry" ? "[A-Za-z]{2}" : undefined} value={details[key]} maxLength={key === "shippingCountry" ? 2 : undefined}
            onChange={(event) => { editedFields.current.add(key); setDetails((previous) => ({ ...previous, [key]: key === "shippingCountry" ? event.target.value.toUpperCase() : event.target.value })); }} />
        </label>)}
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={doorCheck} onChange={(event) => setDoorCheck(event.target.checked)} /> I checked that my furniture fits through my doors and passageways.</label>
        <Button className="w-full" type="submit" disabled={!doorCheck || !quote || busy || profileLoading || missingFields.length > 0 || !/^[A-Z]{2}$/.test(details.shippingCountry)}>Create order</Button>
      </form>}
      {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
    </CardContent>
  </Card>;
}
