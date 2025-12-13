"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Collection } from "@/types/collection.type";

interface CollectionsFilterProps {
  collections: Collection[];
  selectedCollectionId?: string | null;
  onCollectionChange?: (collectionId: string | null) => void;
  onCreateCollection?: () => void;
  loading?: boolean;
}

export function CollectionsFilter({
  collections,
  selectedCollectionId = null,
  onCollectionChange,
  onCreateCollection,
  loading = false,
}: CollectionsFilterProps) {
  const handleValueChange = (value: string) => {
    if (onCollectionChange) {
      // "all" означає показати всі продукти (без фільтра)
      onCollectionChange(value === "all" ? null : value);
    }
  };

  const currentValue = selectedCollectionId || "all";

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2">
      <Tabs
        value={currentValue}
        onValueChange={handleValueChange}
        className="w-auto"
      >
        <TabsList className="bg-transparent p-0 h-auto gap-3">
          {/* "All saved" завжди доступний */}
          <TabsTrigger
            value="all"
            disabled={loading}
            className="
              rounded-full border px-4 py-2 text-sm font-medium transition-all
              bg-white border-transparent text-gray-900 shadow-sm
              data-[state=active]:bg-[#1a1a1a] 
              data-[state=active]:text-white 
              data-[state=active]:border-[#1a1a1a]
              hover:bg-gray-100
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            All saved
          </TabsTrigger>

          {/* Динамічно рендеримо колекції */}
          {collections.map((collection) => (
            <TabsTrigger
              key={collection.id}
              value={collection.id}
              disabled={loading}
              className="
                rounded-full border px-4 py-2 text-sm font-medium transition-all
                bg-white border-gray-200 text-gray-700
                data-[state=active]:bg-[#1a1a1a] 
                data-[state=active]:text-white 
                data-[state=active]:border-[#1a1a1a]
                hover:border-gray-300 hover:bg-gray-50
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {collection.name}
              {collection.isPrivate && (
                <span className="ml-1 text-xs opacity-60">(Private)</span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Кнопка створення нової колекції */}
      <Button
        variant="outline"
        onClick={onCreateCollection}
        disabled={loading}
        className="
          rounded-full border border-dashed border-gray-300 px-4 py-2 h-auto
          text-gray-500 hover:text-gray-900 hover:border-gray-400 hover:bg-white
          bg-white font-normal whitespace-nowrap
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        <Plus className="w-4 h-4 mr-2" />
        New collection
      </Button>
    </div>
  );
}
