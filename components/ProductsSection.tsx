"use client";
import { Product } from "@/types/product.type";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface ProductsSectionProps {
  products: Product[];
  fullWidth?: boolean;
  showFavorite?: boolean;
}

export function ProductsSection({
  products,
  fullWidth = false,
  showFavorite = true,
}: ProductsSectionProps) {
  const containerClass = fullWidth
    ? "py-16 px-4"
    : "py-16 px-4 max-w-7xl mx-auto";
  const gridContainerClass = fullWidth
    ? "py-8 px-4"
    : "py-8 px-4 max-w-7xl mx-auto";

  if (products.length === 0) {
    return (
      <section className={containerClass}>
        <div className="rounded-[32px] border border-white/60 bg-[#f7f4ef]/88 px-6 py-14 text-center shadow-[0_24px_80px_rgba(70,61,50,0.1)] backdrop-blur md:px-10">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
            <Package className="h-12 w-12 text-stone-400" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-stone-900">
            No products found
          </h3>
          <p className="mb-6 text-stone-500">
            We couldn&apos;t find any products at the moment. Please check back
            later.
          </p>
          <Button variant="outline" className="rounded-full px-6">
            Refresh
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className={gridContainerClass}>
      <div className="rounded-[32px] border border-white/60 bg-[#f7f4ef]/88 p-5 shadow-[0_24px_80px_rgba(70,61,50,0.1)] backdrop-blur md:p-7 lg:p-8">
        <div className="flex flex-col gap-5 border-b border-stone-200/70 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-stone-500">
              Curated selection
            </p>
            <h2 className="mt-3 text-3xl font-medium tracking-tight text-stone-950 sm:text-4xl">
              Pieces chosen to continue the same quiet, tactile mood
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-stone-500">
              A softer grid of sculptural furniture, natural finishes and warm
              details that sits comfortably under the new opening showcase.
            </p>
          </div>

          <Button
            variant="outline"
            className="h-12 rounded-full border-stone-300 bg-white px-5 text-stone-800 hover:bg-stone-100"
          >
            Browse all products
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              showFavorite={showFavorite}
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>

      {products.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            className="h-12 rounded-full border-stone-300 bg-white px-8 text-stone-800 hover:bg-stone-100"
          >
            Load more
          </Button>
        </div>
      )}
    </section>
  );
}
