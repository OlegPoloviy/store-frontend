"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { collectionApi } from "@/api/collections.api";
import { Collection } from "@/types/collection.type";

interface CreateCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCollectionCreated?: (collection: Collection) => void;
}

export function CreateCollectionDialog({
  open,
  onOpenChange,
  onCollectionCreated,
}: CreateCollectionDialogProps) {
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валідація
    if (!name.trim()) {
      setError("Collection name is required");
      return;
    }

    if (name.trim().length < 2) {
      setError("Collection name must be at least 2 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const newCollection = await collectionApi.createCollection({
        name: name.trim(),
        isPrivate,
      });

      // Очистити форму
      setName("");
      setIsPrivate(false);

      // Викликати callback
      if (onCollectionCreated) {
        onCollectionCreated(newCollection);
      }

      // Закрити діалог
      onOpenChange(false);
    } catch (err) {
      console.error("Error creating collection:", err);
      setError("Failed to create collection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName("");
      setIsPrivate(false);
      setError("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>
            Create a new collection to organize your favorite items.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Collection Name Input */}
            <div className="grid gap-2">
              <Label htmlFor="name">
                Collection Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g., Living Room, Bathroom"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                disabled={loading}
                className="col-span-3"
                maxLength={50}
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            {/* Private Checkbox */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="private"
                checked={isPrivate}
                onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
                disabled={loading}
              />
              <div className="grid gap-1 leading-none">
                <Label
                  htmlFor="private"
                  className="text-sm font-medium cursor-pointer"
                >
                  Make this collection private
                </Label>
                <p className="text-xs text-gray-500">
                  Only you will be able to see this collection
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Collection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
