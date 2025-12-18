"use client";
import { Product } from "@/types/product.type";
import { Collection } from "@/types/collection.type";
import { useEffect, useState } from "react";
import { productsApi } from "@/api/productApi";
import { collectionApi } from "@/api/collections.api";
import { ViewToggle } from "@/components/ViewToggle";
import { ProductsList } from "@/components/ProductsList";
import { Moodboard } from "@/components/Moodboard";
import { CollectionsFilter } from "@/components/CollectionsFilter";
import { CreateCollectionDialog } from "@/components/CreateCollectionDialog";
import { toast } from "sonner";

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<"list" | "moodboard">("list");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Завантаження улюблених продуктів
  useEffect(() => {
    async function getFavorite() {
      try {
        setLoading(true);
        const favoriteProducts = await productsApi.getAllFavorites();
        setProducts(favoriteProducts);
      } catch (error) {
        console.error("Error fetching favorite products:", error);
      } finally {
        setLoading(false);
      }
    }

    getFavorite();
  }, []);

  // Завантаження колекцій
  useEffect(() => {
    async function getCollections() {
      try {
        setCollectionsLoading(true);
        const userCollections = await collectionApi.getCollections();
        setCollections(userCollections);
      } catch (error) {
        console.error("Error fetching collections:", error);
      } finally {
        setCollectionsLoading(false);
      }
    }

    getCollections();
  }, []);

  // Обробник зміни колекції
  const handleCollectionChange = async (collectionId: string | null) => {
    setSelectedCollectionId(collectionId);

    // Завантажити продукти для вибраної колекції
    try {
      setLoading(true);

      if (collectionId === null) {
        // Якщо вибрано "All saved", завантажити всі улюблені
        const favoriteProducts = await productsApi.getAllFavorites();
        setProducts(favoriteProducts);
      } else {
        // Завантажити продукти конкретної колекції
        const collectionProducts = await collectionApi.getItemsByCollection(
          collectionId
        );
        setProducts(collectionProducts);
      }
    } catch (error) {
      console.error("Error fetching products for collection:", error);
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Обробник відкриття діалогу створення колекції
  const handleCreateCollection = () => {
    setIsDialogOpen(true);
  };

  // Обробник після успішного створення колекції
  const handleCollectionCreated = async (newCollection: Collection) => {
    // Додати нову колекцію до списку
    setCollections((prev) => [...prev, newCollection]);
    // Автоматично вибрати нову колекцію та завантажити її продукти
    await handleCollectionChange(newCollection.id);
  };

  return (
    <div className="pt-20">
      <div className="px-4 py-8">
        <div className="flex justify-between w-full">
          <div>
            <h2 className="text-3xl font-serif text-stone-900 mb-1">
              Your saved ideas
            </h2>
            <p className="text-stone-500">
              This is where your favorite items are stored. Combine them to
              create the perfect space.
            </p>
          </div>
          <ViewToggle view={view} onViewChange={setView} />
        </div>
        <div className="mt-5">
          <CollectionsFilter
            collections={collections}
            selectedCollectionId={selectedCollectionId}
            onCollectionChange={handleCollectionChange}
            onCreateCollection={handleCreateCollection}
            loading={collectionsLoading}
          />
        </div>
        {view === "list" ? (
          <ProductsList
            showFavorite={false}
            products={products}
            loading={loading}
            fullWidth
          />
        ) : (
          <Moodboard products={products} loading={loading} />
        )}
      </div>

      {/* Діалог створення колекції */}
      <CreateCollectionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCollectionCreated={handleCollectionCreated}
      />
    </div>
  );
}
