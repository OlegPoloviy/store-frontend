import { ProductsSection } from "./ProductsSection";
import { Product } from "@/types/product.type";
import { ProductsGridSkeleton } from "./Loader";

interface ProductsListProps {
  products: Product[];
  loading?: boolean;
  fullWidth?: boolean;
  showFavorite?: boolean;
}

export function ProductsList({
  products,
  loading = false,
  fullWidth = false,
  showFavorite = true,
}: ProductsListProps) {
  const skeletonContainerClass = fullWidth
    ? "py-8 px-4 max-w-8xl"
    : "py-8 px-4 max-w-7xl mx-auto";

  if (loading) {
    return (
      <section className={skeletonContainerClass}>
        <ProductsGridSkeleton count={6} />
      </section>
    );
  }

  return (
    <>
      <ProductsSection
        showFavorite={showFavorite}
        products={products}
        fullWidth={fullWidth}
      />
    </>
  );
}
