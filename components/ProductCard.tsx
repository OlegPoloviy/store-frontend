"use client";
import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product.type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, ShoppingCart, Sparkles } from "lucide-react";
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

  const isNewItem = true;

  return (
    <Card className="group h-full overflow-hidden rounded-[28px] border border-white/70 bg-white/92 p-0 shadow-[0_18px_50px_rgba(84,72,57,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(84,72,57,0.14)]">
      <Link href={`/products/${product.id}`} className="block w-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f0ebe4]">
          {isNewItem && (
            <div className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full bg-white/90 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-stone-700 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>NEW</span>
            </div>
          )}

          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0].url}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <ImagePlaceholder />
          )}

          {showFavorite && (
            <button
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className={`absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-[2px] transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart
                className={`h-4 w-4 transition-colors duration-300 ${
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              />
            </button>
          )}
        </div>
      </Link>

      <CardContent className="flex flex-1 flex-col p-0">
        <div className="flex flex-1 flex-col gap-4 p-5">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 flex flex-col"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-stone-400">
                {product.category?.name || "Uncategorized"}
              </p>
              <div className="rounded-full bg-[#f3eee7] px-3 py-1.5 text-sm font-medium text-stone-700">
                {product.currency}
              </div>
            </div>

            <h3 className="mt-3 line-clamp-1 text-2xl font-medium tracking-tight text-stone-950 transition-colors group-hover:text-stone-700">
              {product.title}
            </h3>

            <p className="mt-3 line-clamp-3 text-sm leading-7 text-stone-500">
              {product.description ||
                "Hand-carved from natural materials, ensuring unique texture and durability."}
            </p>
          </Link>

          <div className="mt-auto flex items-end justify-between gap-4 border-t border-stone-100 pt-4">
            <div className="flex flex-col">
              <span className="mb-1 text-[10px] font-medium uppercase tracking-[0.24em] text-stone-400">
                Price
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight text-stone-950">
                  {product.price}
                </span>
                <span className="text-sm font-medium text-stone-500">
                  {product.currency}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleBuyClick}
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-[#f3eee7] text-stone-700 hover:bg-[#e6dccf]"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button
                asChild
                size="icon"
                className="h-12 w-12 rounded-full bg-stone-950 text-white hover:bg-stone-800"
              >
                <Link href={`/products/${product.id}`}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
