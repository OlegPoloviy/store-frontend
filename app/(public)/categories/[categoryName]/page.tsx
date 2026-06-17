"use client";
import { useEffect, useState } from "react";
import { productsApi } from "@/api/productApi";
import { Product } from "@/types/product.type";
import { ProductsList } from "@/components/ProductsList";
import { useParams } from "next/navigation";

export default function ProductsByCategoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { categoryName } = useParams();
  const normalizedCategoryName = String(categoryName || "").replace(/-/g, " ");
  const titleCategoryName = normalizedCategoryName.replace(/\b\w/g, (char) =>
    char.toUpperCase()
  );

  useEffect(() => {
    async function getProducts() {
      try {
        setLoading(true);
        const productsData = await productsApi.getByCategory(
          categoryName as string
        );
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products by category:", error);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-[#d9d6d1] px-4 py-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1760px]">
        <div className="mb-8 rounded-[32px] border border-white/60 bg-[#f7f4ef]/88 px-6 py-8 shadow-[0_24px_80px_rgba(70,61,50,0.1)] backdrop-blur md:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-stone-500">
            Category selection
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-stone-950 sm:text-5xl">
            {titleCategoryName || "Collection"}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-500">
            A focused edit of products from this category, styled to match the
            calmer showcase language across the storefront.
          </p>
        </div>

        <ProductsList products={products} loading={loading} />
      </div>
    </div>
  );
}
