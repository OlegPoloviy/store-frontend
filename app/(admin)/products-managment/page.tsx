"use client";
import { Product } from "@/types/product.type";
import { useEffect, useState } from "react";
import { productsApi } from "@/api/productApi";
import { ProductDataTable } from "@/components/products/data-table";
import { createProductColumns } from "@/components/products/columns";
import { toast } from "sonner";

export default function ProductsManagmentPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllProducts();
  }, []);

  async function getAllProducts() {
    setIsLoading(true);
    try {
      const response = await productsApi.getAll();
      setProducts(response);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (product: Product) => {
    toast.info(`Edit functionality for "${product.title}" coming soon`);
  };

  const handleDelete = async (productId: string) => {
    try {
      // TODO: Implement delete API call
      // await productsApi.delete(productId);
      setProducts(products.filter((p) => p.id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const columns = createProductColumns({
    onEditAction: handleEdit,
    onDeleteAction: handleDelete,
  });

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Product Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your product inventory
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading products...</div>
        </div>
      ) : (
        <ProductDataTable columns={columns} data={products} />
      )}
    </div>
  );
}
