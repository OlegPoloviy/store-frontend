"use client";
import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product.type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Edit3, Sparkles } from "lucide-react";
import Image from "next/image";
import { productsApi } from "@/api/productApi";
import { toast } from "sonner";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

interface ProductCardProps {
  product: Product;
  showFavorite?: boolean;
}

export function ProductCard({
  product,
  showFavorite = true,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(product.isFavorite || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    const previousState = isFavorite;

    setIsFavorite(!isFavorite);

    try {
      if (isFavorite) {
        await productsApi.removeFromFavorites(product.id);
        toast.success("Removed from favorites");
      } else {
        await productsApi.addToFavorite(product.id);
        toast.success("Added to favorites");
      }
    } catch (error) {
      // Відкат при помилці
      setIsFavorite(previousState);
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Логіка купівлі
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isNewItem = true;

  return (
    <Card className="group overflow-hidden border border-gray-200 hover:shadow-2xl hover:border-gray-300 transition-all duration-300 rounded-lg bg-white h-full  flex flex-col p-0">
      <Link href={`/products/${product.id}`} className="block w-full">
        <div className="relative aspect-[5/3] bg-gray-50 overflow-hidden">
          {/* --- ПОКРАЩЕННЯ 1: Бейдж "New" або "Sale" --- */}
          {isNewItem && (
            <div className="absolute top-2 left-2 z-10 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>NEW</span>
            </div>
          )}

          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" // Зробив анімацію трохи плавнішою (duration-700)
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <ImagePlaceholder />
          )}

          {/* Favorite Button */}
          {showFavorite && (
            <button
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className={`absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-[2px] shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 z-10 hover:bg-white ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart
                className={`w-4 h-4 transition-colors duration-300 ${
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              />
            </button>
          )}
        </div>
      </Link>

      <CardContent className="p-0 flex flex-col flex-1">
        {/* --- ПОКРАЩЕННЯ 2: Збільшив padding з p-2 до p-4 для "дорожчого" вигляду --- */}
        <div className="flex-1 p-4 flex flex-col gap-2">
          {/* Category */}
          <Link
            href={`/products/${product.id}`}
            className="flex-1 flex flex-col"
          >
            <div className="flex justify-between items-start">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                {product.category?.name || "Uncategorized"}
              </p>
            </div>

            {/* Title */}
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mt-1">
              {product.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 line-clamp-2 mt-1 leading-relaxed">
              {product.description ||
                "Hand-carved from natural materials, ensuring unique texture and durability."}
            </p>
          </Link>

          {/* Price and Buy Button */}
          <div className="flex items-end justify-between pt-4 mt-auto border-t border-gray-50/50">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-medium mb-[-2px]">
                Price
              </span>
              <div className="flex items-baseline gap-1">
                {/* --- ПОКРАЩЕННЯ 3: Акцент на ціні --- */}
                <span className="text-2xl font-extrabold text-gray-900">
                  {product.price}
                </span>
                <span className="text-sm font-semibold text-gray-500 mb-1">
                  {product.currency}
                </span>
              </div>
            </div>

            <Button
              onClick={handleBuyClick}
              className="bg-gray-900 hover:bg-gray-800 active:scale-95 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="font-medium">Buy</span>
            </Button>
          </div>

          {/* Footer Info (Hidden visual noise mostly, kept very subtle) */}
          <div className="flex items-center justify-between pt-3 mt-1 text-[10px] text-gray-400 border-t border-gray-100">
            {/* Залишив як є, але можна зробити ще світлішим */}
            <div className="flex items-center gap-1 hover:text-gray-600 cursor-pointer transition-colors">
              <Edit3 className="w-3 h-3" />
              <span>Note</span>
            </div>
            <span>{formatDate(product.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
