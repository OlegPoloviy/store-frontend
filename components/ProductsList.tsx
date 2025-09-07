"use client";
import { ProductsSection } from "./ProductsSection";
import { productsApi } from "@/api/productApi";
import { Product } from "@/types/product.type";
import { useEffect, useState } from "react";
import { ProductsGridSkeleton } from "./Loader";

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProducts() {
      try {
        setLoading(true);
        const productsData = await productsApi.getAll();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <ProductsGridSkeleton count={6} />
      </section>
    );
  }

  return (
    <>
      <ProductsSection products={products} />
    </>
  );
}
