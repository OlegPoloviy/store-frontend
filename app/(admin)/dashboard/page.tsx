"use client";
import { useTranslation } from "react-i18next";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Boxes, ChartNoAxesCombined, CircleDollarSign, PackagePlus, PieChart, Users } from "lucide-react";
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { userApi } from "@/lib/api/users.api";
import { productsApi } from "@/lib/api/productApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Product } from "@/types/product.type";
import { type User, type userTable } from "@/types/user.type";

const palette = [1, 2, 3, 4, 5, 6].map((index) => `var(--dashboard-chart-${index})`);
const toDate = (value: Date | string) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; };
const dayKey = (date: Date) => date.toISOString().slice(0, 10);
const label = (date: Date, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", options).format(date);
const money = (value: number, currency: string, locale: string) => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(value);

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const [users, setUsers] = useState<userTable[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [usersResponse, productsResponse] = await Promise.all([userApi.getAll(), productsApi.getAll()]);
      const usersData = Array.isArray(usersResponse) ? usersResponse : usersResponse?.data || [];
      setUsers(usersData.map((user: User) => ({ ...user, createdAt: user.createdAt ? new Date(user.createdAt) : new Date(), updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date() })));
      setProducts(Array.isArray(productsResponse) ? productsResponse : []);
    } catch (error) { console.error("Failed to load dashboard:", error); toast.error(t("Could not load dashboard data")); }
    finally { setLoading(false); }
  }, [t]);
  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const insights = useMemo(() => {
    const today = new Date(); const todayKey = dayKey(today); const weekStart = new Date(today); weekStart.setDate(today.getDate() - 6); weekStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const usersToday = users.filter((user) => { const date = toDate(user.createdAt); return date ? dayKey(date) === todayKey : false; }).length;
    const productsThisMonth = products.filter((product) => { const date = toDate(product.createdAt); return date ? date >= monthStart : false; }).length;
    const dailyData = Array.from({ length: 7 }, (_, index) => { const date = new Date(weekStart); date.setDate(weekStart.getDate() + index); const key = dayKey(date); return { label: label(date, { weekday: "short" }), users: users.filter((u) => { const d = toDate(u.createdAt); return d ? dayKey(d) === key : false; }).length, products: products.filter((p) => { const d = toDate(p.createdAt); return d ? dayKey(d) === key : false; }).length }; });
    const categories = new Map<string, number>();
    const currencyTotals = new Map<string, { total: number; count: number; categories: Map<string, number> }>();
    for (const product of products) {
      const category = product.category?.name || "Uncategorized";
      categories.set(category, (categories.get(category) ?? 0) + 1);
      const currency = product.currency?.toUpperCase();
      const price = Number.parseFloat(product.price);
      if (!currency || !/^[A-Z]{3}$/.test(currency) || !Number.isFinite(price)) continue;
      const totals = currencyTotals.get(currency) ?? { total: 0, count: 0, categories: new Map<string, number>() };
      totals.total += price;
      totals.count += 1;
      totals.categories.set(category, (totals.categories.get(category) ?? 0) + price);
      currencyTotals.set(currency, totals);
    }
    const categoryData = Array.from(categories, ([name, products]) => ({ name, products }))
      .sort((a, b) => b.products - a.products || a.name.localeCompare(b.name));
    const countryCount = new Set(users.map((user) => user.country?.trim()).filter(Boolean)).size;
    const latestProducts = [...products].sort((a, b) => (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0)).slice(0, 5);
    return { usersToday, productsThisMonth, currencyTotals, countryCount, dailyData, categoryData, latestProducts };
  }, [products, users]);

  const currencies = [...insights.currencyTotals.keys()].sort(
    (a, b) => insights.currencyTotals.get(b)!.count - insights.currencyTotals.get(a)!.count || a.localeCompare(b)
  );
  const currency = insights.currencyTotals.has(selectedCurrency) ? selectedCurrency : currencies[0];
  const currencyTotals = insights.currencyTotals.get(currency);
  const categoryValues = [...(currencyTotals?.categories ?? [])]
    .sort(([a, aValue], [b, bValue]) => bValue - aValue || a.localeCompare(b));
  const maxCategoryValue = Math.max(0, categoryValues[0]?.[1] ?? 0);
  const catalogMix = insights.categoryData.slice(0, insights.categoryData.length > 6 ? 5 : 6)
    .map(({ name, products }) => ({ key: "category:" + name, name: t(name), products }));
  if (insights.categoryData.length > 6) {
    catalogMix.push({
      key: "other-categories",
      name: t("Other categories"),
      products: insights.categoryData.slice(5).reduce((sum, item) => sum + item.products, 0),
    });
  }

  const metrics = [
    ["Registered customers", users.length.toLocaleString(i18n.language), t("{{count}} joined today", { count: insights.usersToday }), Users, "bg-stone-950 text-white"],
    ["Catalog products", products.length.toLocaleString(i18n.language), t("{{count}} added this month", { count: insights.productsThisMonth }), Boxes, "bg-[#e9ded0] text-stone-950"],
    ["Catalog value", currencyTotals ? money(currencyTotals.total, currency, i18n.language) : "—", "Based on listed prices", CircleDollarSign, "bg-[#dcebe6] text-stone-950"],
    ["Customer locations", insights.countryCount.toLocaleString(i18n.language), "Countries represented", ChartNoAxesCombined, "bg-[#f4e4dc] text-stone-950"],
  ] as const;

  return <div className="admin-dashboard mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
    <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">{t("Store overview")}</p><h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">{t("Good morning, here's your store.")}</h1><p className="mt-2 text-sm leading-6 text-stone-500 sm:text-base">{t("A concise view of catalog growth and customer activity for the last 7 days.")}</p></div><div className="flex flex-wrap gap-3"><Button asChild variant="outline" className="rounded-full border-stone-200 bg-white px-5"><Link href="/products-managment">{t("Manage catalog")}<ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button><Button asChild className="rounded-full bg-stone-950 px-5 text-white hover:bg-stone-800"><Link href="/products-managment/create"><PackagePlus className="mr-2 h-4 w-4" />{t("Add product")}</Link></Button></div></header>
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([title, value, detail, Icon, tone]) => <Card key={title} className={`${tone} admin-metric gap-0 rounded-[24px] border-0 py-0 shadow-none`}><CardContent className="p-5 sm:p-6"><div className="mb-10 flex justify-between"><p className="text-sm font-medium opacity-70">{t(title)}</p><span className="grid h-10 w-10 place-items-center rounded-full bg-white/20"><Icon className="h-5 w-5" /></span></div><p className="text-3xl font-semibold tracking-tight">{value}</p><p className="mt-2 text-xs font-medium opacity-65">{t(detail)}</p></CardContent></Card>)}</section>
    <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,0.85fr)]"><Card className="rounded-[26px] border-stone-200/80 bg-white py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="mb-6 flex justify-between"><div><p className="text-lg font-semibold tracking-tight">{t("New activity")}</p><p className="mt-1 text-sm text-stone-500">{t("Customers and products added each day.")}</p></div><span className="grid size-9 shrink-0 self-start place-items-center rounded-full bg-stone-100"><ChartNoAxesCombined aria-hidden="true" className="size-4" /></span></div><div className="h-[290px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={insights.dailyData} margin={{ top: 8, right: 8, left: -20 }}><CartesianGrid vertical={false} stroke="var(--dashboard-grid)" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--dashboard-axis)", fontSize: 12 }} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "var(--dashboard-axis)", fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: 14, border: "1px solid var(--dashboard-grid)", backgroundColor: "var(--dashboard-tooltip-bg)", color: "var(--dashboard-tooltip-text)" }} /><Line type="monotone" dataKey="users" name="New customers" stroke={palette[0]} strokeWidth={3} dot={{ r: 4, fill: palette[0], strokeWidth: 0 }} /><Line type="monotone" dataKey="products" name="New products" stroke={palette[1]} strokeWidth={3} dot={{ r: 4, fill: palette[1], strokeWidth: 0 }} /></LineChart></ResponsiveContainer></div><div className="mt-2 flex gap-4 text-xs font-medium text-stone-600"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: palette[0] }} />{t("New customers")}</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: palette[1] }} />{t("New products")}</span></div></CardContent></Card>
    <Card className="min-w-0 rounded-[26px] border-stone-200/80 bg-white py-0 shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-semibold tracking-tight">{t("Catalog mix")}</p>
            <p className="mt-1 text-sm text-stone-500">{t("Products by category.")}</p>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f1e7dc]">
            <PieChart aria-hidden="true" className="size-4" />
          </span>
        </div>
        {catalogMix.length ? (
          <>
            <div className="relative mx-auto h-[190px] w-full max-w-[240px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <RechartsPieChart>
                  <Pie data={catalogMix} dataKey="products" nameKey="name" cx="50%" cy="50%" innerRadius="57%" outerRadius="82%" paddingAngle={3} stroke="none" isAnimationActive={false}>
                    {catalogMix.map(({ key }, index) => <Cell key={key} fill={palette[index]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid var(--dashboard-grid)", backgroundColor: "var(--dashboard-tooltip-bg)", color: "var(--dashboard-tooltip-text)" }} />
                </RechartsPieChart>
              </ResponsiveContainer>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center text-xl font-semibold tabular-nums">
                {products.length.toLocaleString(i18n.language)}
              </span>
            </div>
            <ul className="grid gap-2.5 text-sm text-stone-600">
              {catalogMix.map(({ key, name, products }, index) => (
                <li key={key} className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full" style={{ backgroundColor: palette[index] }} />
                  <span className="min-w-0 flex-1 break-words">{name}</span>
                  <b className="shrink-0 text-stone-900 tabular-nums">{products.toLocaleString(i18n.language)}</b>
                </li>
              ))}
            </ul>
          </>
        ) : <p className="grid h-[190px] place-items-center text-sm text-stone-500">{t("No catalog categories yet.")}</p>}
      </CardContent>
    </Card></section>
    <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
      <Card className="min-w-0 rounded-[26px] border-stone-200/80 bg-white py-0 shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="category-value-title" className="text-lg font-semibold tracking-tight">{t("Category value")}</h2>
              <p id="category-value-description" className="mt-1 text-sm text-stone-500">{t("Listed value of each catalog category.")}</p>
            </div>
            {currencies.length > 1 && (
              <select aria-label={t("Currency")} value={currency} onChange={(event) => setSelectedCurrency(event.target.value)} className="rounded-md border border-stone-200 bg-white px-2.5 py-1.5 text-sm text-stone-700">
                {currencies.map((code) => <option key={code}>{code}</option>)}
              </select>
            )}
          </div>
          {categoryValues.length ? (
            <ul aria-labelledby="category-value-title" aria-describedby="category-value-description" tabIndex={0} className="max-h-96 space-y-3 overflow-y-auto pr-2 text-sm">
              {categoryValues.map(([name, value]) => (
                <li key={name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(7rem,max-content)]">
                  <span className="min-w-0 break-words text-stone-700">{t(name)}</span>
                  <span aria-hidden="true" className="col-span-2 row-start-2 block h-2.5 overflow-hidden rounded-full bg-stone-100 sm:col-span-1 sm:col-start-2 sm:row-start-1">
                    <span className="block h-full rounded-full" style={{ width: maxCategoryValue ? Math.max(0, value / maxCategoryValue * 100) + "%" : "0%", backgroundColor: palette[2] }} />
                  </span>
                  <span className="col-start-2 row-start-1 whitespace-nowrap text-right tabular-nums sm:col-start-3">{money(value, currency, i18n.language)}</span>
                </li>
              ))}
            </ul>
          ) : <p className="py-10 text-center text-sm text-stone-500">{t("No catalog categories yet.")}</p>}
        </CardContent>
      </Card>
    <Card className="rounded-[26px] border-stone-200/80 bg-white py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="mb-5 flex justify-between"><div><p className="text-lg font-semibold tracking-tight">{t("Recently added")}</p><p className="mt-1 text-sm text-stone-500">{t("Newest items in the catalog.")}</p></div><Link href="/products-managment" className="text-sm font-semibold underline-offset-4 hover:underline">{t("See all")}</Link></div><div className="space-y-1">{insights.latestProducts.length ? insights.latestProducts.map((product) => { const createdAt = toDate(product.createdAt); return <Link key={product.id} href={`/products-managment/${product.id}/edit`} className="flex items-center justify-between gap-4 rounded-2xl px-3 py-3 transition hover:bg-stone-50"><div className="min-w-0"><p className="truncate text-sm font-semibold text-stone-900">{product.title}</p><p className="mt-1 text-xs text-stone-500">{product.category?.name || "Uncategorized"}{createdAt ? ` · ${label(createdAt, { month: "short", day: "numeric" })}` : ""}</p></div><p className="shrink-0 text-sm font-semibold text-stone-700">{product.currency || "USD"} {Number.parseFloat(product.price || "0").toLocaleString("en-US")}</p></Link>; }) : <p className="py-16 text-center text-sm text-stone-500">{t("No products have been added yet.")}</p>}</div></CardContent></Card></section>
    {loading && <div className="fixed inset-x-0 top-20 z-50 h-0.5 overflow-hidden bg-stone-200"><div className="h-full w-1/3 animate-pulse bg-stone-950" /></div>}
  </div>;
}
