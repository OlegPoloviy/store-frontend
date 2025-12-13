import { Hero } from "@/components/Hero";
import { ProductsList } from "@/components/ProductsList";
import { FooterSection } from "@/components/FooterSection";
import { productsApiServer } from "@/api/productApi.server";
import { Product } from "@/types/product.type";

export default async function HomePage() {
  let products: Product[] = [];

  try {
    products = await productsApiServer.getAll();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <>
      <div className="bg-[#FAFAFA] h-screen">
        <Hero />
        <ProductsList products={products} />
        <FooterSection />
      </div>
    </>
  );
}
