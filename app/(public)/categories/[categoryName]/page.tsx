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
    <div className="relative top-20">
      <ProductsList products={products} loading={loading} />
    </div>
  );
}
