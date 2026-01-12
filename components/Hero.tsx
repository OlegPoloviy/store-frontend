"use client";

import { Category } from "@/types/category.type";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { Truck, Clock, Shield } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface HeroProps {
  categories: Category[];
}

export function Hero({ categories }: HeroProps) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 10000); // 10 seconds

    return () => clearInterval(intervalId);
  }, [api]);

  // Default hero if no categories are provided
  if (!categories || categories.length === 0) {
    return (
      <section className="relative min-h-[600px] flex items-center justify-center bg-stone-50">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-stone-800">
            Welcome to Carpathians
          </h1>
          <p className="text-stone-600">
            Discover handcrafted furniture for your home.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-white pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-2">
              <Badge
                variant="outline"
                className="border-emerald-200 text-emerald-700 bg-emerald-50/50 uppercase tracking-widest text-[10px] font-bold px-3 py-1"
              >
                Our Collections
              </Badge>
              <h2 className="text-4xl font-bold text-stone-900 tracking-tight">
                Handcrafted Excellence
              </h2>
              <p className="text-stone-500 max-w-md text-lg">
                Browse through our curated sections of sustainable furniture
              </p>
            </div>
            <div className="flex gap-3 pb-1">
              <CarouselPrevious className="static translate-y-0 h-12 w-12 border-stone-200 hover:bg-stone-50 hover:text-emerald-700 text-stone-600 rounded-full transition-all duration-300" />
              <CarouselNext className="static translate-y-0 h-12 w-12 border-stone-200 hover:bg-stone-50 hover:text-emerald-700 text-stone-600 rounded-full transition-all duration-300" />
            </div>
          </div>

          <CarouselContent className="-ml-6">
            {categories.map((category) => (
              <CarouselItem
                key={category.id}
                className="pl-6 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <Link
                  href={`/categories/${category.name}`}
                  className="group block"
                >
                  <div className="relative h-[450px] w-full rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-500 group-hover:shadow-xl border border-stone-100">
                    {/* Background Image */}
                    {category.categoryImage ? (
                      <Image
                        src={category.categoryImage}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-200" />
                    )}

                    {/* Sophisticated Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-500" />

                    {/* Content */}
                    <div className="absolute inset-0 p-10 flex flex-col justify-end">
                      <div className="space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <Badge className="w-fit bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-100 hover:bg-emerald-500/30 transition-colors uppercase tracking-widest text-[10px] font-bold px-3 py-1">
                          Collection
                        </Badge>
                        <div>
                          <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            {category.name}
                          </h3>
                          <p className="text-stone-200 text-sm line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            {category.subtitle ||
                              `Explore our exclusive range of ${category.name.toLowerCase()} furniture, handcrafted with precision.`}
                          </p>
                        </div>

                        <div className="flex items-center text-emerald-400 text-sm font-bold gap-2 group-hover:text-emerald-300 transition-colors pt-2">
                          <span className="uppercase tracking-widest text-[11px]">
                            Shop Collection
                          </span>
                          <span className="group-hover:translate-x-2 transition-transform duration-300">
                            →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Features Bar */}
        <div className="grid md:grid-cols-3 gap-12 mt-20 pt-16 border-t border-stone-100">
          <div className="flex items-start space-x-5 group">
            <div className="bg-emerald-50 p-4 rounded-2xl group-hover:bg-emerald-100 transition-colors duration-300">
              <Truck className="w-7 h-7 text-emerald-700" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-lg mb-1">
                Free Delivery
              </h4>
              <p className="text-stone-500 leading-relaxed">
                Complimentary shipping on all handcrafted pieces over $500
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-5 group">
            <div className="bg-emerald-50 p-4 rounded-2xl group-hover:bg-emerald-100 transition-colors duration-300">
              <Clock className="w-7 h-7 text-emerald-700" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-lg mb-1">
                Expert Support
              </h4>
              <p className="text-stone-500 leading-relaxed">
                Consult with our design experts for custom furniture needs
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-5 group">
            <div className="bg-emerald-50 p-4 rounded-2xl group-hover:bg-emerald-100 transition-colors duration-300">
              <Shield className="w-7 h-7 text-emerald-700" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-lg mb-1">
                Handmade Guarantee
              </h4>
              <p className="text-stone-500 leading-relaxed">
                Each piece is certified for quality and sustainable sourcing
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
