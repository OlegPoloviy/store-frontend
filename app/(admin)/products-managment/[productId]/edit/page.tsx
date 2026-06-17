import { productsApiServer } from "@/api/productApi.server";
import { ProductCreationForm } from "@/components/ProductCreationForm";

interface EditProductPageProps {
  params: Promise<{ productId: string }>;
}

export default async function EditProductPage({
  params: pageParams,
}: EditProductPageProps) {
  const { productId } = await pageParams;
  const product = await productsApiServer.getById(productId);

  return (
    <div className="container mx-auto py-8 px-4">
      <ProductCreationForm mode="edit" product={product} />
    </div>
  );
}
