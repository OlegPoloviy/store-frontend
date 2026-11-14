"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

interface GalleryImage {
  url: string;
  altText?: string | null;
  isMain?: boolean;
}

export function ProductImageGallery({ images, productTitle }: {
  images: GalleryImage[];
  productTitle: string;
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(() => Math.max(0, images.findIndex((image) => image.isMain)));
  const current = images[selected] ?? images[0];

  return (
    <div className="min-w-0 overflow-hidden rounded-[28px] border border-border bg-card p-2 sm:p-3">
      <div className="relative aspect-[5/4] overflow-hidden rounded-[20px] bg-muted">
        {current ? (
          <Image
            src={current.url}
            alt={current.altText || productTitle}
            fill
            sizes="(max-width: 1023px) 100vw, (max-width: 1280px) 52vw, 660px"
            className="object-contain"
            priority={selected === Math.max(0, images.findIndex((image) => image.isMain))}
          />
        ) : <ImagePlaceholder />}
      </div>
      {images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto p-1 sm:mt-3" role="group" aria-label={t("Product photos")}>
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={t("Show photo {{number}}", { number: index + 1 })}
              aria-pressed={index === selected}
              className="relative size-14 shrink-0 overflow-hidden rounded-xl border-2 border-transparent bg-muted transition-colors hover:border-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:border-primary sm:size-16"
            >
              <Image src={image.url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
