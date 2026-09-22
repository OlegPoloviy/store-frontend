"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Armchair, ArrowRight, Heart, ImageIcon, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Category } from "@/types/category.type";
import { Product } from "@/types/product.type";

interface HomeShowcaseProps {
  categories: Category[];
  products: Product[];
  latestProducts: Product[];
}

function getProductImage(product?: Product) {
  return product?.images?.[0]?.url || product?.category?.categoryImage || null;
}

function getCategoryImage(category?: Category) {
  return category?.categoryImage || null;
}

function ProductImage({
  src,
  alt,
  priority = false,
  className = "",
  compact = false,
}: {
  src: string | null;
  alt: string;
  priority?: boolean;
  className?: string;
  compact?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[#eee7dc] ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.92),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(164,143,115,0.34),_transparent_42%)]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(135deg,rgba(255,255,255,0.36)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.36)_50%,rgba(255,255,255,0.36)_75%,transparent_75%,transparent)] [background-size:26px_26px]" />
        <div className="absolute bottom-0 left-1/2 h-28 w-[78%] -translate-x-1/2 rounded-t-full bg-stone-900/10 blur-2xl" />

        <div
          className={`relative flex flex-col items-center justify-center border border-white/70 bg-white/40 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_20px_50px_rgba(84,72,57,0.1)] backdrop-blur-sm ${
            compact
              ? "h-[74%] w-[74%] rounded-[22px] p-4"
              : "h-[72%] w-[76%] rounded-[28px] p-6"
          }`}
        >
          <div
            className={`relative flex items-center justify-center rounded-full bg-stone-950 text-white shadow-[0_18px_40px_rgba(41,37,36,0.18)] ${
              compact ? "h-14 w-14" : "h-28 w-28"
            }`}
          >
            <Armchair
              className={compact ? "h-7 w-7" : "h-12 w-12"}
              strokeWidth={1.5}
            />
            <span
              className={`absolute flex items-center justify-center rounded-full bg-emerald-100 text-emerald-800 ring-white/80 ${
                compact
                  ? "-right-1 -top-1 h-6 w-6 ring-2"
                  : "-right-2 -top-2 h-9 w-9 ring-4"
              }`}
            >
              <ImageIcon className={compact ? "h-3 w-3" : "h-4 w-4"} />
            </span>
          </div>
          <p
            className={`font-semibold tracking-tight text-stone-950 ${
              compact ? "mt-3 text-sm" : "mt-6 text-lg"
            }`}
          >
            Image coming soon
          </p>
          <p
            className={`mt-2 max-w-[240px] text-stone-600 ${
              compact ? "line-clamp-2 text-xs leading-5" : "text-sm leading-6"
            }`}
          >
            Handcrafted piece selected for the Carpathians collection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={`object-cover ${className}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
    />
  );
}

export function HomeShowcase({
  categories,
  products,
  latestProducts,
}: HomeShowcaseProps) {
  const newDealProducts = latestProducts.length > 0 ? latestProducts : products;
  const dealSlides = newDealProducts.length > 0 ? newDealProducts : [undefined];
  const spotlightProduct = products[1] || products[0];
  const editorialProduct = products[2] || products[0];
  const accentProduct = products[3] || products[1] || products[0];
  const topCategories = categories.slice(0, 6);
  const autoplay = useRef(
    Autoplay({ delay: 5200, stopOnInteraction: false, stopOnMouseEnter: true })
  ).current;
  const [dealApi, setDealApi] = useState<CarouselApi>();
  const [activeDealIndex, setActiveDealIndex] = useState(0);

  useEffect(() => {
    if (!dealApi) return;

    const updateActiveDeal = () => setActiveDealIndex(dealApi.selectedScrollSnap());
    updateActiveDeal();
    dealApi.on("select", updateActiveDeal);
    dealApi.on("reInit", updateActiveDeal);

    return () => {
      dealApi.off("select", updateActiveDeal);
      dealApi.off("reInit", updateActiveDeal);
    };
  }, [dealApi]);

  return (
    <section className="relative overflow-hidden px-3 pb-8 pt-32 sm:px-5 sm:pt-40 lg:px-8 lg:pt-44">
      <div className="absolute inset-0 -z-10 bg-[#d9d6d1]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.72),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.58),_transparent_28%)]" />
      <div className="absolute inset-0 -z-10 opacity-40 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="mx-auto max-w-[1760px] rounded-[32px] border border-white/60 bg-[#f7f4ef]/88 p-3 shadow-[0_24px_80px_rgba(70,61,50,0.12)] backdrop-blur md:p-5 lg:p-7">
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-14 w-14 rounded-full bg-white text-stone-700 shadow-sm hover:bg-white"
          >
            <Users className="h-5 w-5" />
          </Button>
          <div className="flex gap-3 overflow-x-auto pb-1 lg:flex-1">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.name}`}
                className="shrink-0 rounded-full bg-white px-6 py-4 text-sm font-medium text-stone-700 shadow-sm transition hover:bg-stone-900 hover:text-white"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-[1.08fr_1.28fr_0.72fr]">
          <article className="relative overflow-hidden rounded-[30px] bg-[#d8d1c8] p-6 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.42),_transparent_45%)]" />
            <div className="relative flex min-h-[460px] flex-col gap-8">
              <div>
                <p className="inline-block rounded-[22px] bg-white/32 px-4 py-2 text-4xl font-light tracking-tight text-stone-950 shadow-[0_16px_40px_rgba(54,47,39,0.08)] backdrop-blur-sm sm:text-5xl">
                  New Deals
                </p>
              </div>

              <Carousel
                setApi={setDealApi}
                opts={{
                  align: "start",
                  loop: dealSlides.length > 1,
                  duration: 28,
                }}
                plugins={dealSlides.length > 1 ? [autoplay] : []}
                className="group/carousel"
              >
                <CarouselContent className="ml-0">
                  {dealSlides.map((product, index) => (
                    <CarouselItem key={product?.id ?? "empty"} className="pl-0">
                      <div className="rounded-[30px] border border-white/80 bg-white/82 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),inset_0_-1px_0_rgba(109,94,75,0.06)] backdrop-blur transition-colors duration-500 group-hover/carousel:border-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-4xl font-semibold tracking-tight text-stone-950">
                      ${product?.price || "508"}
                    </p>
                    <p className="mt-1 text-lg text-stone-500">
                      {product?.title || "Long Chair"}
                    </p>
                  </div>
                  <div className="rounded-full bg-stone-100 px-4 py-3 text-sm font-medium text-stone-700">
                    <span className="mr-2 text-amber-400">★</span>4.9
                  </div>
                </div>

                <Link
                  href={
                    product ? `/products/${product.id}` : "/products"
                  }
                  className="group mt-5 block"
                >
                  <div className="relative overflow-hidden rounded-[26px] bg-[#f3efe8] aspect-[4/5]">
                    <ProductImage
                      src={getProductImage(product)}
                      alt={product?.title || "Featured furniture"}
                      priority={index === 0}
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="mt-5 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-3 text-sm text-stone-500">
                    <span>{index + 1} / {dealSlides.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      asChild
                      size="icon"
                      className="h-12 w-12 rounded-full bg-stone-950 text-white hover:bg-stone-800"
                    >
                      <Link
                        href={
                          product
                            ? `/products/${product.id}`
                            : "/products"
                        }
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {dealSlides.length > 1 && (
                  <div className="mt-5 flex items-center justify-between gap-3 px-1">
                    <div className="flex items-center gap-1.5" aria-label="Carousel pagination">
                      {dealSlides.map((product, index) => (
                        <button
                          key={`deal-dot-${product?.id ?? index}`}
                          type="button"
                          aria-label={`Go to deal ${index + 1}`}
                          aria-current={index === activeDealIndex ? "true" : undefined}
                          onClick={() => dealApi?.scrollTo(index)}
                          className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 ${
                            index === activeDealIndex
                              ? "w-7 bg-stone-900"
                              : "w-2 bg-white/75 hover:bg-white"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <CarouselPrevious className="static h-10 w-10 translate-y-0 rounded-full border border-white/70 bg-white/80 text-stone-700 shadow-[0_8px_18px_-14px_rgba(61,50,37,0.5)] hover:bg-white" />
                      <CarouselNext className="static h-10 w-10 translate-y-0 rounded-full border border-white/70 bg-white/80 text-stone-700 shadow-[0_8px_18px_-14px_rgba(61,50,37,0.5)] hover:bg-white" />
                    </div>
                  </div>
                )}
              </Carousel>
            </div>
          </article>

          <div className="grid gap-4">
            <article className="relative overflow-hidden rounded-[30px] bg-[#d5cec5] p-6 md:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.38),_transparent_40%)]" />
              <div className="relative flex min-h-[560px] flex-col justify-between">
                <div className="max-w-xl rounded-[24px] bg-white/28 px-4 py-3 shadow-[0_18px_46px_rgba(54,47,39,0.08)] backdrop-blur-sm">
                  <p className="text-4xl font-light tracking-tight text-stone-950 sm:text-5xl">
                    Great Value Deals
                  </p>
                  <p className="mt-3 text-base leading-7 text-stone-700 sm:text-lg">
                    Find items on sale with handcrafted finishes, warm oak
                    details and quietly sculptural silhouettes.
                  </p>
                </div>

                <div className="relative mx-auto flex w-full max-w-[520px] flex-1 items-end justify-center pt-8">
                  <div className="absolute bottom-4 left-0 rounded-full bg-white/88 px-5 py-4 text-base font-medium text-stone-800 shadow-sm">
                    <span className="mr-2 text-amber-400">★</span>4.9
                  </div>
                  <div className="relative h-[420px] w-full overflow-hidden rounded-[28px]">
                    <ProductImage
                      src={getProductImage(spotlightProduct)}
                      alt={spotlightProduct?.title || "Spotlight chair"}
                      priority
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </article>

            <div className="grid gap-4 lg:grid-cols-[0.95fr_1.15fr]">
              <article className="rounded-[30px] bg-white p-6 shadow-sm">
                <Badge
                  variant="outline"
                  className="rounded-full border-stone-200 px-4 py-2 text-xs uppercase tracking-[0.2em] text-stone-500"
                >
                  Exclusive
                </Badge>
                <div className="mt-8 space-y-4">
                  <h2 className="text-3xl font-medium tracking-tight text-stone-950">
                    {editorialProduct?.title || "PureSpace Focus Duo"}
                  </h2>
                  <p className="max-w-sm text-base leading-7 text-stone-500">
                    {editorialProduct?.description ||
                      "Sleek, minimalist furniture chosen for calm rooms, tactile materials and long-lasting comfort."}
                  </p>
                </div>
              </article>

              <article className="relative overflow-hidden rounded-[30px] bg-[#f0ebe4] p-5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 z-10 h-12 w-12 rounded-full bg-white/88 text-rose-500 shadow-sm hover:bg-white"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
                <Link
                  href={
                    editorialProduct
                      ? `/products/${editorialProduct.id}`
                      : "/products"
                  }
                  className="block"
                >
                  <div className="relative aspect-[16/11] overflow-hidden rounded-[24px]">
                    <ProductImage
                      src={getProductImage(editorialProduct)}
                      alt={editorialProduct?.title || "Editorial piece"}
                      compact
                      className="object-cover transition duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-full bg-[#d8ccbb] pl-5 pr-2 py-2 text-stone-900">
                    <span className="text-lg font-medium">Open</span>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-stone-950 text-white">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </article>
            </div>
          </div>

          <div className="grid gap-4">
            <article className="rounded-[30px] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <Badge
                  variant="outline"
                  className="rounded-full border-stone-200 px-4 py-2 text-xs uppercase tracking-[0.2em] text-stone-500"
                >
                  Studio approach
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-6">
                <p className="text-3xl font-medium tracking-tight text-stone-950">
                  Crafted around your space
                </p>
                <p className="mt-3 text-base leading-7 text-stone-500">
                  Thoughtful furniture guidance for materials, proportions and
                  finishes that feel personal without overcomplicating the room.
                </p>
              </div>

              <div className="mt-8 grid gap-3 text-sm font-medium text-stone-700">
                <div className="rounded-full bg-stone-100 px-5 py-3">
                  Material-first recommendations
                </div>
                <div className="rounded-full bg-[#eadfd2] px-5 py-3 text-stone-800">
                  Custom sizing conversations
                </div>
                <div className="rounded-full bg-stone-950 px-5 py-3 text-white">
                  Finish and styling direction
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <span className="h-1.5 w-12 rounded-full bg-stone-900" />
                <span className="h-1.5 w-5 rounded-full bg-stone-200" />
                <span className="h-1.5 w-5 rounded-full bg-stone-200" />
              </div>
            </article>

            <article className="rounded-[30px] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <Badge
                  variant="outline"
                  className="rounded-full border-stone-200 px-4 py-2 text-xs uppercase tracking-[0.2em] text-stone-500"
                >
                  Get a bonus
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-6">
                <p className="text-2xl font-medium tracking-tight text-stone-950">
                  Discover exclusive drops
                </p>
                <p className="mt-3 text-base leading-7 text-stone-500">
                  Get early access to new collections, limited finishes and
                  studio notes from our team.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <Input
                  placeholder="Email"
                  className="h-12 rounded-full border-stone-200 bg-stone-50 px-5"
                />
                <Button className="h-12 w-full rounded-full bg-stone-950 text-white hover:bg-stone-800">
                  Subscribe
                </Button>
              </div>
            </article>

            <article className="overflow-hidden rounded-[30px] bg-white p-4 shadow-sm">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[26px] bg-stone-100">
                <ProductImage
                  src={getProductImage(accentProduct) || getCategoryImage(categories[0])}
                  alt={accentProduct?.title || "Studio pick"}
                  compact
                  className="object-cover"
                />
                <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-4">
                  <Badge
                    variant="outline"
                    className="rounded-full border-white/70 bg-white/86 px-4 py-2 text-xs uppercase tracking-[0.2em] text-stone-700 shadow-sm backdrop-blur"
                  >
                    Studio pick
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-white/88 text-stone-800 shadow-sm backdrop-blur hover:bg-white"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="px-2 pb-2 pt-5">
                <p className="text-2xl font-medium tracking-tight text-stone-950">
                  Join us for more refined living ideas.
                </p>
                <p className="mt-3 text-base leading-7 text-stone-500">
                  Materials, proportions and styling notes chosen to make the
                  home feel composed.
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
