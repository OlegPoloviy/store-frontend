"use client";
import { ProductsSection } from "./ProductsSection";
import { productsApi } from "@/api/productApi";
import { Product } from "@/types/product.type";
import { useEffect, useState } from "react";

export function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function getProducts() {
      try {
        const productsData = await productsApi.getAll();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    getProducts();
  }, []);

  return (
    <>
      <ProductsSection products={products} />
    </>
  );
}
