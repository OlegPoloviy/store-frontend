import { ProductsList } from "@/components/ProductsList";
import { productsApiServer } from "@/lib/api/productApi.server";
import { Product } from "@/types/product.type";
import { getServerTranslation } from "@/lib/i18n/server";
import { productDescriptionText } from "@/lib/util/productDescription";
import Link from "next/link";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { t } = await getServerTranslation();
  const { q } = await searchParams;
  const query = (typeof q === "string" ? q : q?.[0] ?? "").trim();
  let products: Product[] = [];

  try {
    products = await productsApiServer.getAll();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
  if (query) {
    const term = query.toLowerCase();
    products = products.filter((product) => [
      product.title, product.sku, product.uniqueIdentifier, product.category?.name,
      product.primaryMaterial, product.color, productDescriptionText(product.description),
    ].some((value) => value?.toLowerCase().includes(term)));
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="pt-28">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">{t("All Products")}</h1>
            {query ? (
              <div className="mt-4 flex flex-wrap justify-center gap-3 text-muted-foreground">
                <p>{t("Search results for {{query}}", { query })}</p>
                <Link href="/products" className="font-medium text-foreground underline">{t("Clear search")}</Link>
              </div>
            ) : <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">{t("Discover our complete collection of premium hand-made furniture")}</p>}
          </div>
          {query && !products.length
            ? <p className="py-10 text-center text-muted-foreground">{t("No products match this search.")}</p>
            : <ProductsList products={products} />}
        </div>
      </div>
    </div>
  );
}
