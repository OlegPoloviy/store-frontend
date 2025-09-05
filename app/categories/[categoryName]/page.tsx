"use client";
import { useEffect, useState } from "react";
import { productsApi } from "@/api/productApi";
import { Product } from "@/types/product.type";
import { ProductsSection } from "@/components/ProductsSection";
import { useParams } from "next/navigation";
import { ProductsGridSkeleton } from "@/components/Loader";

export default function ProductsByCategoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { categoryName } = useParams();

  useEffect(() => {
    async function getProducts() {
      setLoading(true);
      const productsData = await productsApi.getByCategory(
        categoryName as string
      );
      setProducts(productsData);
      setLoading(false);
    }
    getProducts();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="relative top-20">
        <ProductsGridSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="relative top-20">
      <ProductsSection products={products} />
    </div>
  );
}
