"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Boxes, ChartNoAxesCombined, CircleDollarSign, PackagePlus, PieChart, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { userApi } from "@/api/users.api";
import { productsApi } from "@/api/productApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Product } from "@/types/product.type";
import { type User, type userTable } from "@/types/user.type";

const palette = ["#171412", "#a07a52", "#0f766e", "#c46e52", "#77716b", "#dcc7af"];
const toDate = (value: Date | string) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? null : date; };
const dayKey = (date: Date) => date.toISOString().slice(0, 10);
const label = (date: Date, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", options).format(date);
const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export default function DashboardPage() {
  const [users, setUsers] = useState<userTable[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [usersResponse, productsResponse] = await Promise.all([userApi.getAll(), productsApi.getAll()]);
      const usersData = Array.isArray(usersResponse) ? usersResponse : usersResponse?.data || [];
      setUsers(usersData.map((user: User) => ({ ...user, createdAt: user.createdAt ? new Date(user.createdAt) : new Date(), updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date() })));
      setProducts(Array.isArray(productsResponse) ? productsResponse : []);
    } catch (error) { console.error("Failed to load dashboard:", error); toast.error("Could not load dashboard data"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const insights = useMemo(() => {
    const today = new Date(); const todayKey = dayKey(today); const weekStart = new Date(today); weekStart.setDate(today.getDate() - 6); weekStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const usersToday = users.filter((user) => { const date = toDate(user.createdAt); return date ? dayKey(date) === todayKey : false; }).length;
    const productsThisMonth = products.filter((product) => { const date = toDate(product.createdAt); return date ? date >= monthStart : false; }).length;
    const inventoryValue = products.reduce((sum, product) => sum + (Number.parseFloat(product.price) || 0), 0);
    const dailyData = Array.from({ length: 7 }, (_, index) => { const date = new Date(weekStart); date.setDate(weekStart.getDate() + index); const key = dayKey(date); return { label: label(date, { weekday: "short" }), users: users.filter((u) => { const d = toDate(u.createdAt); return d ? dayKey(d) === key : false; }).length, products: products.filter((p) => { const d = toDate(p.createdAt); return d ? dayKey(d) === key : false; }).length }; });
    const categories = new Map<string, { products: number; value: number }>();
    products.forEach((product) => { const name = product.category?.name || "Uncategorized"; const current = categories.get(name) || { products: 0, value: 0 }; current.products += 1; current.value += Number.parseFloat(product.price) || 0; categories.set(name, current); });
    const categoryData = Array.from(categories.entries()).map(([name, values]) => ({ name, ...values })).sort((a, b) => b.products - a.products);
    const countryCount = new Set(users.map((user) => user.country?.trim()).filter(Boolean)).size;
    const latestProducts = [...products].sort((a, b) => (toDate(b.createdAt)?.getTime() || 0) - (toDate(a.createdAt)?.getTime() || 0)).slice(0, 5);
    return { usersToday, productsThisMonth, inventoryValue, countryCount, dailyData, categoryData, latestProducts };
  }, [products, users]);

  const metrics = [
    ["Registered customers", users.length.toLocaleString("en-US"), `${insights.usersToday} joined today`, Users, "bg-stone-950 text-white"],
    ["Catalog products", products.length.toLocaleString("en-US"), `${insights.productsThisMonth} added this month`, Boxes, "bg-[#e9ded0] text-stone-950"],
    ["Catalog value", money(insights.inventoryValue), "Based on listed prices", CircleDollarSign, "bg-[#dcebe6] text-stone-950"],
    ["Customer locations", insights.countryCount.toLocaleString("en-US"), "Countries represented", ChartNoAxesCombined, "bg-[#f4e4dc] text-stone-950"],
  ] as const;

  return <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
    <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Store overview</p><h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">Good morning, here&apos;s your store.</h1><p className="mt-2 text-sm leading-6 text-stone-500 sm:text-base">A concise view of catalog growth and customer activity for the last 7 days.</p></div><div className="flex flex-wrap gap-3"><Button asChild variant="outline" className="rounded-full border-stone-200 bg-white px-5"><Link href="/products-managment">Manage catalog <ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button><Button asChild className="rounded-full bg-stone-950 px-5 text-white hover:bg-stone-800"><Link href="/products-managment/create"><PackagePlus className="mr-2 h-4 w-4" />Add product</Link></Button></div></header>
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([title, value, detail, Icon, tone]) => <Card key={title} className={`${tone} gap-0 rounded-[24px] border-0 py-0 shadow-none`}><CardContent className="p-5 sm:p-6"><div className="mb-10 flex justify-between"><p className="text-sm font-medium opacity-70">{title}</p><span className="grid h-10 w-10 place-items-center rounded-full bg-white/20"><Icon className="h-5 w-5" /></span></div><p className="text-3xl font-semibold tracking-tight">{value}</p><p className="mt-2 text-xs font-medium opacity-65">{detail}</p></CardContent></Card>)}</section>
    <section className="mt-6 grid gap-6 xl:grid-cols-[1.55fr_0.85fr]"><Card className="rounded-[26px] border-stone-200/80 bg-white py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="mb-6 flex justify-between"><div><p className="text-lg font-semibold tracking-tight">New activity</p><p className="mt-1 text-sm text-stone-500">Customers and products added each day.</p></div><span className="rounded-full bg-stone-100 p-2.5"><ChartNoAxesCombined className="h-4 w-4" /></span></div><div className="h-[290px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={insights.dailyData} margin={{ top: 8, right: 8, left: -20 }}><CartesianGrid vertical={false} stroke="#eee9e3" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#857b72", fontSize: 12 }} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#857b72", fontSize: 12 }} /><Tooltip contentStyle={{ borderRadius: 14, border: "1px solid #e7e0d8" }} /><Line type="monotone" dataKey="users" name="New customers" stroke="#171412" strokeWidth={3} dot={{ r: 4, fill: "#171412", strokeWidth: 0 }} /><Line type="monotone" dataKey="products" name="New products" stroke="#b87a48" strokeWidth={3} dot={{ r: 4, fill: "#b87a48", strokeWidth: 0 }} /></LineChart></ResponsiveContainer></div><div className="mt-2 flex gap-4 text-xs font-medium text-stone-600"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-stone-950" />New customers</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#b87a48]" />New products</span></div></CardContent></Card>
    <Card className="rounded-[26px] border-stone-200/80 bg-white py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="flex justify-between"><div><p className="text-lg font-semibold tracking-tight">Catalog mix</p><p className="mt-1 text-sm text-stone-500">Products by category.</p></div><span className="rounded-full bg-[#f1e7dc] p-2.5"><PieChart className="h-4 w-4" /></span></div>{insights.categoryData.length ? <><div className="h-[190px]"><ResponsiveContainer width="100%" height="100%"><RechartsPieChart><Pie data={insights.categoryData} dataKey="products" nameKey="name" innerRadius={54} outerRadius={78} paddingAngle={4} stroke="none">{insights.categoryData.map((item, index) => <Cell key={item.name} fill={palette[index % palette.length]} />)}</Pie><Tooltip contentStyle={{ borderRadius: 14, border: "1px solid #e7e0d8" }} /></RechartsPieChart></ResponsiveContainer></div><div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">{insights.categoryData.slice(0, 6).map((item, index) => <div key={item.name} className="flex justify-between gap-2 text-stone-600"><span className="flex min-w-0 items-center gap-2 truncate"><i className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: palette[index % palette.length] }} />{item.name}</span><b className="text-stone-900">{item.products}</b></div>)}</div></> : <p className="grid h-[248px] place-items-center text-sm text-stone-500">No catalog categories yet.</p>}</CardContent></Card></section>
    <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]"><Card className="rounded-[26px] border-stone-200/80 bg-white py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="mb-6"><p className="text-lg font-semibold tracking-tight">Category value</p><p className="mt-1 text-sm text-stone-500">Listed value of each catalog category.</p></div><div className="h-[260px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={insights.categoryData} layout="vertical" margin={{ right: 10, left: 0 }}><CartesianGrid horizontal={false} stroke="#eee9e3" /><XAxis type="number" hide /><YAxis type="category" dataKey="name" width={85} axisLine={false} tickLine={false} tick={{ fill: "#625a53", fontSize: 12 }} /><Tooltip formatter={(value) => money(Number(value))} contentStyle={{ borderRadius: 14, border: "1px solid #e7e0d8" }} /><Bar dataKey="value" name="Listed value" fill="#0f766e" radius={[0, 7, 7, 0]} barSize={20} /></BarChart></ResponsiveContainer></div></CardContent></Card>
    <Card className="rounded-[26px] border-stone-200/80 bg-white py-0 shadow-sm"><CardContent className="p-5 sm:p-6"><div className="mb-5 flex justify-between"><div><p className="text-lg font-semibold tracking-tight">Recently added</p><p className="mt-1 text-sm text-stone-500">Newest items in the catalog.</p></div><Link href="/products-managment" className="text-sm font-semibold underline-offset-4 hover:underline">See all</Link></div><div className="space-y-1">{insights.latestProducts.length ? insights.latestProducts.map((product) => { const createdAt = toDate(product.createdAt); return <Link key={product.id} href={`/products-managment/${product.id}/edit`} className="flex items-center justify-between gap-4 rounded-2xl px-3 py-3 transition hover:bg-stone-50"><div className="min-w-0"><p className="truncate text-sm font-semibold text-stone-900">{product.title}</p><p className="mt-1 text-xs text-stone-500">{product.category?.name || "Uncategorized"}{createdAt ? ` · ${label(createdAt, { month: "short", day: "numeric" })}` : ""}</p></div><p className="shrink-0 text-sm font-semibold text-stone-700">{product.currency || "USD"} {Number.parseFloat(product.price || "0").toLocaleString("en-US")}</p></Link>; }) : <p className="py-16 text-center text-sm text-stone-500">No products have been added yet.</p>}</div></CardContent></Card></section>
    {loading && <div className="fixed inset-x-0 top-20 z-50 h-0.5 overflow-hidden bg-stone-200"><div className="h-full w-1/3 animate-pulse bg-stone-950" /></div>}
  </div>;
}
