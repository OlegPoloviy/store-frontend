import { HomeShowcase } from "@/components/HomeShowcase";
import { ProductsList } from "@/components/ProductsList";
import { FooterSection } from "@/components/FooterSection";
import { productsApiServer } from "@/api/productApi.server";
import { categoryApiServer } from "@/api/category.api.server";
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
      <div className="bg-[#FAFAFA] min-h-screen">
        <HomeShowcase
          categories={categories}
          products={products}
          latestProducts={latestProducts}
        />
        <ProductsList products={products} />
        <FooterSection />
      </div>
    </>
  );
}
