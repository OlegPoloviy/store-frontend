import { Card, CardContent } from "@/components/ui/card";

interface LoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function Loader({ message = "Loading...", size = "md" }: LoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Card className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200/50">
        <CardContent className="p-0 flex flex-col items-center space-y-6">
          {/* Animated Spinner */}
          <div className="relative">
            <div
              className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full animate-spin`}
            >
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          </div>

          {/* Loading Message */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {message}
            </h3>
            <p className="text-sm text-gray-500">
              Please wait while we fetch the latest products
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton loader for product cards
export function ProductSkeleton() {
  return (
    <Card className="group overflow-hidden border-0 shadow-none hover:shadow-lg transition-all duration-300 cursor-pointer">
      <CardContent className="p-0">
        {/* Product Image Container */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-lg mb-4 animate-pulse">
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>

          {/* Price Section */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
            </div>

            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Grid skeleton loader for multiple products
export function ProductsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}
