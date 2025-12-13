import { ProductsSection } from "./ProductsSection";
import { Product } from "@/types/product.type";
import { ProductsGridSkeleton } from "./Loader";

interface ProductsListProps {
  products: Product[];
  loading?: boolean;
  fullWidth?: boolean;
}

export function ProductsList({
  products,
  loading = false,
  fullWidth = false,
}: ProductsListProps) {
  const skeletonContainerClass = fullWidth
    ? "py-8 px-4"
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
      <ProductsSection products={products} fullWidth={fullWidth} />
    </>
  );
}
