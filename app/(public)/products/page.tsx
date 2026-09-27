import { ProductsList } from "@/components/ProductsList";
import { productsApiServer } from "@/api/productApi.server";
import { Product } from "@/types/product.type";
import { getServerTranslation } from "@/lib/i18n/server";

export default async function ProductsPage() {
  const { t } = await getServerTranslation();
  let products: Product[] = [];

  try {
    products = await productsApiServer.getAll();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">{t("All Products")}</h1>
            <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">{t("Discover our complete collection of premium hand-made furniture")}</p>
          </div>
          <ProductsList products={products} />
        </div>
      </div>
    </div>
  );
}
