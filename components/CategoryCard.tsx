"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Category } from "@/types/category.type";
import { useRouter } from "next/navigation";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();
  return (
    <Card
      key={category.id}
      className="group overflow-hidden border-0 shadow-none hover:shadow-lg transition-all duration-300 cursor-pointer p-0"
      onClick={() => router.push(`/categories/${category.name}`)}
    >
      <CardContent className="p-0">
        {/* Category Image Container */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-lg mb-4">
          {category.categoryImage ? (
            <Image
              src={category.categoryImage}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center group-hover:scale-105 transition-transform duration-300 relative overflow-hidden`}
            >
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-8 h-8 border-2 border-gray-300 rounded-full"></div>
                <div className="absolute top-8 right-6 w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                <div className="absolute bottom-6 left-6 w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-gray-300 rounded-full"></div>
              </div>

              {/* Main icon */}
              <div className="text-6xl text-gray-500 mb-2 relative z-10">
                📦
              </div>

              {/* Category name overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent p-4">
                <div className="text-white text-sm font-medium text-center">
                  {category.name}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Info */}
        <div className="space-y-2">
          <h3 className="font-medium text-lg text-gray-900 group-hover:text-gray-700 transition-colors">
            {category.name}
          </h3>

          <p className="text-sm text-gray-500 line-clamp-2">
            {category.subtitle || "Explore collection"}
          </p>

          {/* Action Section */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-600">View items</p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/categories/${category.name}`);
              }}
            >
              →
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
