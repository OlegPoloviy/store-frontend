"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryCard } from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/category.type";
import { categoryApi } from "@/api/category.api";
import { Loader } from "@/components/Loader";
import { ArrowRight } from "lucide-react";

export default function CatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getCategories() {
      try {
        setLoading(true);
        const categoriesData = await categoryApi.getAll();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }
    getCategories();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#d9d6d1] px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1760px] rounded-[32px] border border-white/60 bg-[#f7f4ef]/88 p-8 shadow-[0_24px_80px_rgba(70,61,50,0.1)] backdrop-blur">
          <Loader message="Loading categories..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d9d6d1] px-4 py-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1760px] rounded-[32px] border border-white/60 bg-[#f7f4ef]/88 p-5 shadow-[0_24px_80px_rgba(70,61,50,0.1)] backdrop-blur md:p-8 lg:p-10">
        <div className="mb-10 flex flex-col gap-5 border-b border-stone-200/70 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-stone-500">
              Category index
            </p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight text-stone-950 sm:text-5xl">
              Browse collections shaped around rooms, rituals and materials
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-500">
              Start from a category and move through warm, tactile product
              groups without losing the calmer editorial feel of the homepage.
            </p>
          </div>

          <Button
            className="h-12 rounded-full bg-stone-950 px-5 text-white hover:bg-stone-800"
            onClick={() => router.push("/products")}
          >
            View all products
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
}
