"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { productsApi } from "@/api/productApi";
import { cartApi } from "@/api/cart.api";
import { CopyButton } from "@/components/CopyButton";
import { AddToCollectionButton } from "@/components/AddToCollectionButton";
import { useState } from "react";

interface ProductActionsProps {
  productId: string;
  initialIsFavorite?: boolean;
}

export function ProductActions({
  productId,
  initialIsFavorite = false,
}: ProductActionsProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      const body = { productId, quantity: 1 };
      const result = await cartApi.addToCart(body);
      console.log(result);
      toast.success("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleFavoriteToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const previousState = isFavorite;

    // Оптимістичне оновлення UI
    setIsFavorite(!isFavorite);

    try {
      if (isFavorite) {
        await productsApi.removeFromFavorites(productId);
        toast.success("Removed from favorites");
      } else {
        await productsApi.addToFavorite(productId);
        toast.success("Added to favorites");
      }
    } catch (error) {
      // Відкат при помилці
      setIsFavorite(previousState);
      console.error("Error toggling favorite:", error);
      toast.error(
        previousState
          ? "Failed to remove from favorites"
          : "Failed to add to favorites"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="flex space-x-4">
        <Button
          onClick={handleAddToCart}
          size="lg"
          className="flex-1 bg-gray-900 hover:bg-gray-800"
        >
          Add to Cart
        </Button>
        <Button
          onClick={handleFavoriteToggle}
          variant="outline"
          size="lg"
          className={`px-4 transition-colors ${
            isFavorite
              ? "bg-red-50 border-red-300 hover:bg-red-100"
              : "hover:bg-gray-50"
          }`}
          disabled={isLoading}
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </Button>
        <CopyButton />
      </div>

      {/* Secondary Actions */}
      <div className="flex space-x-4">
        <AddToCollectionButton productId={productId} />
      </div>
    </div>
  );
}
