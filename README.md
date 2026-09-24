# 🪵 Carpathian Wood — Custom Furniture Store

## Checkout and local mock payments

The cart and checkout UI use the API described in the checkout contract. Guest cart tokens are held in an HttpOnly cookie by the Next.js `/api/store` proxy and are forwarded as `x-cart-token`; authenticated requests forward the Supabase JWT. The browser does not call the WayForPay webhook. The quote and order totals come from the API in currency minor units.

Point `API_URL` (server-side) or `NEXT_PUBLIC_API_URL` to the checkout API. For a local API, run its checkout database migration and configure `NODE_ENV=development`, `PAYMENT_MODE=mock`, and `MOCK_SHIPPING_RATES_MINOR_JSON` on the API process. The mock API binds to `127.0.0.1`. Create a cart, fill the shipping form, and use **Approve mock payment** or **Decline mock payment**; a declined attempt can be retried. The UI polls the order endpoint for the confirmed status.

Real payments require the backend's WayForPay configuration and an HTTPS-reachable `WAYFORPAY_SERVICE_URL` pointing to its callback route. The browser submits the supplied payment fields to the hosted payment page, and the order is considered paid only after the verified callback updates the API status.

**Carpathian Wood** is a modern web application for ordering **custom and hand-crafted furniture** made from authentic **Carpathian wood**.  
This repository contains the **frontend** part of the project.

---

## ✨ Features

- 🛋️ Elegant and minimalistic UI for browsing handmade furniture  
- 🪚 Custom order system for personalized designs  
- 🪑 Detailed product pages with high-resolution images and material descriptions  
- 🛒 Responsive shopping cart and secure checkout  
- 🌲 Eco-friendly concept — locally sourced Carpathian wood  
- 🌐 SEO-optimized and fully responsive for desktop & mobile devices  

---

## 🧰 Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | [Next.js 15](https://nextjs.org/) |
| UI Library | [Shadcn]/ Tailwind CSS |
| State Management | React Context / Zustand |
| Auth & Backend | [Supabase](https://supabase.com/) |
| Deployment | [Vercel](https://vercel.com/) |
| API | REST / GraphQL ready |

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/carpathian-wood-frontend.git
cd carpathian-wood-frontend
