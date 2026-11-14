import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers, MessageCircle, Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { SupportLink } from "@/components/chat/SupportLink";
import { Button } from "@/components/ui/button";
import { getServerTranslation } from "@/lib/i18n/server";
import type { Category } from "@/types/category.type";
import type { Product } from "@/types/product.type";

export async function HomeShowcase({ categories, products, latestProducts }: {
  categories: Category[];
  products: Product[];
  latestProducts: Product[];
}) {
  const { t } = await getServerTranslation();
  const arrivals = (latestProducts.length ? latestProducts : products).slice(0, 8);
  const catalogCategories = categories
    .map((category) => ({
      ...category,
      items: products.filter((product) => (product.category?.id ?? product.categoryId) === category.id),
    }))
    .filter(({ items }) => !products.length || items.length > 0);

  return (
    <main className="mx-auto max-w-[1440px] space-y-12 px-4 pb-14 pt-32 sm:px-6 sm:pt-36 lg:space-y-16 lg:px-8">
      <section className="relative isolate flex min-h-[320px] items-end overflow-hidden rounded-[32px] bg-stone-950 p-6 text-white sm:min-h-[390px] sm:p-10 lg:p-14">
        <Image
          src="/images/background_hero.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1440px) 100vw, 1440px"
          className="-z-20 object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {t("Wood and stone, crafted by hand")}
          </h1>
          <p className="mt-4 max-w-md text-base text-white/90 sm:text-lg">{t("Furniture and washbasins from the Carpathians.")}</p>
          <Button asChild className="mt-6 rounded-full bg-white px-5 text-stone-950 hover:bg-white/90 dark:bg-stone-100 dark:text-stone-950">
            <Link href={catalogCategories.length ? "#shop-categories" : "/products"}>
              {t("Browse the catalog")}<ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <form action="/products" role="search" className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2.5 sm:p-3">
        <Search aria-hidden="true" className="ml-2 size-5 shrink-0 text-muted-foreground" />
        <input type="search" name="q" aria-label={t("Search furniture...")} placeholder={t("Search furniture...")} className="h-10 min-w-0 flex-1 rounded-lg bg-transparent px-2 text-sm outline-ring focus-visible:outline-2" />
        <Button type="submit" className="rounded-xl">{t("Search")}</Button>
      </form>

      {catalogCategories.length > 0 && (
        <section id="shop-categories" aria-labelledby="categories-heading" className="scroll-mt-32">
          <SectionHeading id="categories-heading" title={t("Shop by category")} href="/categories" link={t("All categories")} />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {catalogCategories.map((category) => {
              const label = category.name.split("/").at(-1)?.trim() || category.name;
              const image = category.categoryImage || category.items.find((item) => item.images?.length)?.images?.[0]?.url;
              return (
                <li key={category.id}>
                  <Link href={`/categories/${encodeURIComponent(category.name)}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                    <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-muted">
                      {image ? (
                        <Image src={image} alt="" fill sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 20vw" className="object-cover motion-safe:transition-transform motion-safe:group-hover:scale-105" />
                      ) : <Layers aria-hidden="true" className="size-8 text-muted-foreground" />}
                    </div>
                    <span className="flex items-center justify-between gap-2 p-3 text-sm font-medium sm:p-4">
                      {label}<ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {arrivals.length > 0 && (
        <section aria-labelledby="arrivals-heading">
          <SectionHeading id="arrivals-heading" title={t(latestProducts.length ? "New arrivals" : "Products")} href="/products" link={t("Browse all products")} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {arrivals.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      )}

      <section id="custom-orders" aria-labelledby="workshop-heading" className="grid scroll-mt-32 overflow-hidden rounded-[28px] border border-border bg-card text-card-foreground md:grid-cols-2">
        <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
          <h2 id="workshop-heading" className="text-3xl font-semibold tracking-tight">{t("About the workshop")}</h2>
          <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">{t("Explore the materials we work with, how we make our furniture, and what can be made to order.")}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/about">{t("About us")}<ArrowRight aria-hidden="true" className="size-4" /></Link>
            </Button>
            <SupportLink className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold hover:bg-muted">
              <MessageCircle aria-hidden="true" className="size-4" />{t("Ask about custom orders")}
            </SupportLink>
          </div>
        </div>
        <div className="relative min-h-48 bg-muted sm:min-h-64">
          <Image src="/images/bakcground_2.webp" alt="" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
        </div>
      </section>
    </main>
  );
}

function SectionHeading({ id, title, href, link }: { id: string; title: string; href: string; link: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
      <h2 id={id} className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      <Link href={href} className="inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline">
        {link}<ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}
