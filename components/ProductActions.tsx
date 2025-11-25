"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { productsApi } from "@/api/productApi";
import { CopyButton } from "@/components/CopyButton";
import { useState, useEffect } from "react";

interface ProductActionsProps {
  productId: string;
}

export function ProductActions({ productId }: ProductActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const status = await productsApi.checkIfFavorite(productId);
        setIsFavorite(status);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    checkFavoriteStatus();
  }, [productId]);

  const handleFavoriteToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isFavorite) {
        const result = await productsApi.removeFromFavorites(productId);
        console.log(result);
        toast.success(`Removed "${result.title}" from favorites`);
        setIsFavorite(false);
      } else {
        const result = await productsApi.addToFavorite(productId);
        toast.success(
          `Successfully added "${result.product.title}" to favorites`
        );
        setIsFavorite(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        isFavorite
          ? "Failed to remove from favorites"
          : "Failed to add to favorites"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-4">
      <Button size="lg" className="flex-1 bg-gray-900 hover:bg-gray-800">
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
  );
}
