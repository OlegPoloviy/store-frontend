"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Category } from "@/types/category.type";
import { useRouter } from "next/navigation";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();
  return (
    <Card
      key={category.id}
      className="group cursor-pointer overflow-hidden rounded-[28px] border border-white/70 bg-white/92 p-0 shadow-[0_18px_50px_rgba(84,72,57,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(84,72,57,0.14)]"
      onClick={() => router.push(`/categories/${category.name}`)}
    >
      <CardContent className="p-0">
        <div className="relative mb-0 aspect-[4/3] overflow-hidden bg-[#f0ebe4]">
          {category.categoryImage ? (
            <Image
              src={category.categoryImage}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div
              className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(231,226,218,0.92)_45%,_rgba(212,206,198,0.9))] transition-transform duration-500 group-hover:scale-105"
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute left-6 top-6 h-10 w-10 rounded-full border border-stone-300"></div>
                <div className="absolute bottom-6 right-6 h-16 w-16 rounded-full border border-stone-300"></div>
              </div>

              <div className="relative z-10 flex h-full w-full items-center justify-center">
                <ImagePlaceholder
                  className="bg-transparent text-stone-500"
                  iconClassName="mb-2 h-10 w-10"
                  textClassName="text-xs"
                />
              </div>
            </div>
          )}

          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-stone-600 shadow-sm backdrop-blur-sm">
            Collection
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-stone-400">
                Category
              </p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight text-stone-950 transition-colors group-hover:text-stone-700">
                {category.name}
              </h3>
            </div>
            <div className="rounded-full bg-[#f3eee7] px-3 py-1.5 text-sm font-medium text-stone-700">
              Curated
            </div>
          </div>

          <p className="line-clamp-3 text-sm leading-7 text-stone-500">
            {category.subtitle ||
              "Explore a refined selection of furniture pieces shaped around this collection."}
          </p>

          <div className="flex items-center justify-between border-t border-stone-100 pt-4">
            <p className="text-sm font-medium text-stone-500">View collection</p>

            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-[#f3eee7] text-stone-700 hover:bg-[#e6dccf]"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/categories/${category.name}`);
              }}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
