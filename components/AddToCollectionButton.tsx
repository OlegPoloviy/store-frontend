"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Collection } from "@/types/collection.type";
import { collectionApi } from "@/api/collections.api";
import { CreateCollectionDialog } from "@/components/CreateCollectionDialog";
import { FolderPlus, Check } from "lucide-react";
import { toast } from "sonner";

interface AddToCollectionButtonProps {
  productId: string;
}

export function AddToCollectionButton({
  productId,
}: AddToCollectionButtonProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);

  // Завантаження колекцій при відкритті діалогу
  useEffect(() => {
    if (isDialogOpen) {
      fetchCollections();
    }
  }, [isDialogOpen]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const userCollections = await collectionApi.getCollections();
      setCollections(userCollections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast.error("Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionClick = async (collectionId: string) => {
    // TODO: Додати API метод для додавання продукту в колекцію
    try {
      await collectionApi.addToCollection(collectionId, productId);
      toast.success("Added product to collection");
    } catch (error) {
      toast.error("Failed to add product to collection");
    }
  };

  const handleCreateCollection = () => {
    setIsDialogOpen(false);
    setIsCreateDialogOpen(true);
  };

  const handleCollectionCreated = (newCollection: Collection) => {
    setCollections([...collections, newCollection]);
    setIsCreateDialogOpen(false);
    setIsDialogOpen(true);
    toast.success("Collection created successfully");
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleOpenDialog}
        variant="outline"
        size="lg"
        className="px-4 hover:bg-gray-50"
      >
        <FolderPlus className="w-5 h-5 mr-2" />
        Add to Collection
      </Button>

      {/* Dialog з колекціями */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add to Collection</DialogTitle>
            <DialogDescription>
              Choose a collection to add this product to
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading collections...
              </div>
            ) : collections.length === 0 ? (
              // Якщо колекцій немає
              <div className="text-center py-8">
                <FolderPlus className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Collections Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first collection to organize your favorite
                  products
                </p>
                <Button
                  onClick={handleCreateCollection}
                  className="bg-gray-900 hover:bg-gray-800"
                >
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Create First Collection
                </Button>
              </div>
            ) : (
              // Список колекцій
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => handleCollectionClick(collection.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:border-gray-300 ${
                      selectedCollections.includes(collection.id)
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          selectedCollections.includes(collection.id)
                            ? "bg-gray-900"
                            : "bg-gray-100"
                        }`}
                      >
                        <FolderPlus
                          className={`w-5 h-5 ${
                            selectedCollections.includes(collection.id)
                              ? "text-white"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">
                          {collection.name}
                        </p>
                        {collection.isPrivate && (
                          <p className="text-xs text-gray-500">Private</p>
                        )}
                      </div>
                    </div>
                    {selectedCollections.includes(collection.id) && (
                      <Check className="w-5 h-5 text-gray-900" />
                    )}
                  </button>
                ))}

                {/* Кнопка створення нової колекції */}
                <button
                  onClick={handleCreateCollection}
                  className="w-full flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FolderPlus className="w-5 h-5 text-gray-600" />
                  </div>
                  <p className="font-medium text-gray-700">
                    Create New Collection
                  </p>
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog створення колекції */}
      <CreateCollectionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCollectionCreated={handleCollectionCreated}
      />
    </>
  );
}
