"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import { useState } from "react";

interface ProductImage {
  url: string;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
}

export function ProductImageGallery({
  images,
  productTitle,
}: ProductImageGalleryProps) {
  const [displayedImages, setDisplayedImages] =
    useState<ProductImage[]>(images);

  const handleThumbnailClick = (clickedIndex: number) => {
    // Create a new array with the clicked image at the front
    const newImages = [...displayedImages];
    const clickedImage = newImages[clickedIndex + 1]; // +1 because index 0 is the main image

    // Swap: put clicked image at position 0, and move the current main image to the clicked position
    newImages[clickedIndex + 1] = newImages[0];
    newImages[0] = clickedImage;

    setDisplayedImages(newImages);
  };

  if (!images || images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            <Package className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">No Image Available</p>
            <p className="text-sm text-center px-4">Image will be added soon</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={displayedImages[0].url}
          alt={productTitle}
          width={600}
          height={600}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Thumbnail Images */}
      {displayedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {displayedImages.slice(1, 5).map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
            >
              <Image
                src={image.url}
                alt={`${productTitle} ${index + 2}`}
                width={150}
                height={150}
                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
