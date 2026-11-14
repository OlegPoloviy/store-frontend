import { HomeShowcase } from "@/components/HomeShowcase";
import { FooterSection } from "@/components/FooterSection";
import { productsApiServer } from "@/lib/api/productApi.server";
import { categoryApiServer } from "@/lib/api/category.api.server";
import { Product } from "@/types/product.type";
import { Category } from "@/types/category.type";

export default async function HomePage() {
  let products: Product[] = [];
  let latestProducts: Product[] = [];
  let categories: Category[] = [];

  try {
    [products, latestProducts, categories] = await Promise.all([
      productsApiServer.getAll(),
      productsApiServer.getLatest(10),
      categoryApiServer.getAll(),
    ]);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <HomeShowcase
          categories={categories}
          products={products}
          latestProducts={latestProducts}
        />
        <FooterSection />
      </div>
    </>
  );
}
