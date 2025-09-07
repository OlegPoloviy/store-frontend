import { Product } from "@/types/product.type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import Image from "next/image";

interface ProductsSectionProps {
  products: Product[];
}

export function ProductsSection({ products }: ProductsSectionProps) {
  if (products.length === 0) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500 mb-6">
            We couldn&apos;t find any products at the moment. Please check back
            later.
          </p>
          <Button variant="outline" className="px-6">
            Refresh
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group overflow-hidden border-0 shadow-none hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <CardContent className="p-0">
              {/* Product Image Container */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-lg mb-4">
                <Image
                  src={product.images[0].url}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="font-medium text-lg text-gray-900 group-hover:text-gray-700 transition-colors">
                  {product.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {product.description || "See more"}
                </p>

                {/* Price Section */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <p>{product.price}</p>
                    <p>{product.currency}</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    +
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Optional: Load More Button */}
      {products.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="px-8">
            Load more
          </Button>
        </div>
      )}
    </section>
  );
}
