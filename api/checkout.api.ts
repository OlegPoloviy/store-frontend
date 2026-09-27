import { storeClient } from "./storeClient";

export interface ShippingDetails {
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  shippingCountry: string;
  shippingAddress: string;
  shippingCity: string;
  shippingRegion: string;
  shippingPostalCode: string;
}

export interface PaymentInstruction {
  provider?: string;
  action: string;
  method: string;
  fields: Record<string, string | number | Array<string | number>>;
}

export interface CheckoutOrder {
  orderId: string;
  status?: string;
  payment?: PaymentInstruction;
  currency?: string;
  totalMinor?: number;
}

export interface CheckoutQuote {
  currency?: string;
  itemsTotalMinor?: number;
  shippingMinor?: number;
  totalMinor?: number;
}

export const checkoutApi = {
  quote: async (country: string) => (await storeClient.get<CheckoutQuote>("/checkout/quote", { params: { country } })).data,
  create: async (body: ShippingDetails, key: string) => (await storeClient.post<CheckoutOrder>("/checkout", body, { headers: { "Idempotency-Key": key } })).data,
  order: async (id: string) => (await storeClient.get<CheckoutOrder>(`/checkout/orders/${encodeURIComponent(id)}`)).data,
  retry: async (id: string) => (await storeClient.post<CheckoutOrder>(`/checkout/orders/${encodeURIComponent(id)}/retry`)).data,
  mockPayment: async (id: string, outcome: "approved" | "declined") => (await storeClient.post<CheckoutOrder>(`/checkout/orders/${encodeURIComponent(id)}/mock-payment`, { outcome })).data,
};
