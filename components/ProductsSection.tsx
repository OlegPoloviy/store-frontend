"use client";
import { Product } from "@/types/product.type";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { ProductCard } from "./ProductCard";

interface ProductsSectionProps {
  products: Product[];
  fullWidth?: boolean;
}

export function ProductsSection({
  products,
  fullWidth = false,
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
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-6">
            We couldn&apos;t find any products at the moment. Please check back
            later.
          </p>
          <Button variant="outline" className="px-6">
            Refresh
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className={gridContainerClass}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="px-8">
            Load more
          </Button>
        </div>
      )}
    </section>
  );
}
