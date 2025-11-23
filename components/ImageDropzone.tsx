"use client";

import { useState, useCallback, useEffect } from "react";
import { Upload, X, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface ImageFile {
  file: File;
  preview: string;
  isMain: boolean;
}

interface ImageDropzoneProps {
  images: ImageFile[];
  onChange: (images: ImageFile[]) => void;
  maxImages?: number;
  maxSize?: number; // in MB
}

export function ImageDropzone({
  images,
  onChange,
  maxImages = 10,
  maxSize = 5,
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug: log images when they change
  useEffect(() => {
    console.log("Current images:", images);
    images.forEach((img, index) => {
      console.log(`Image ${index}:`, {
        filename: img.file.name,
        preview: img.preview,
        isMain: img.isMain,
        type: img.file.type,
        size: img.file.size,
      });
    });
  }, [images]);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return `File must be an image (got ${file.type})`;
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `Image must be smaller than ${maxSize}MB`;
    }
    return null;
  };

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) {
        console.log("No files selected");
        return;
      }

      console.log(`Processing ${files.length} files...`);
      setError(null);

      const newFiles: ImageFile[] = [];
      const fileArray = Array.from(files);

      // Check total count
      if (images.length + fileArray.length > maxImages) {
        const errorMsg = `Maximum ${maxImages} images allowed`;
        setError(errorMsg);
        console.error(errorMsg);
        return;
      }

      for (const file of fileArray) {
        console.log("Processing file:", file.name, file.type, file.size);

        const validationError = validateFile(file);
        if (validationError) {
          console.error("Validation error:", validationError);
          setError(validationError);
          continue;
        }

        try {
          const preview = URL.createObjectURL(file);
          console.log("Created preview URL:", preview);

          newFiles.push({
            file,
            preview,
            isMain: images.length === 0 && newFiles.length === 0,
          });
        } catch (err) {
          console.error("Error creating object URL:", err);
          setError("Failed to process image");
        }
      }

      if (newFiles.length > 0) {
        console.log(`Adding ${newFiles.length} new files`);
        onChange([...images, ...newFiles]);
      } else {
        console.warn("No valid files to add");
      }
    },
    [images, maxImages, maxSize, onChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      console.log("Files dropped:", files.length);
      handleFiles(files);
    },
    [handleFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("File input changed");
      handleFiles(e.target.files);
      // Reset input value so the same file can be selected again
      e.target.value = "";
    },
    [handleFiles]
  );

  const removeImage = useCallback(
    (index: number) => {
      console.log("Removing image at index:", index);
      const newImages = images.filter((_, i) => i !== index);

      // If we removed the main image and there are still images, make the first one main
      if (images[index].isMain && newImages.length > 0) {
        newImages[0].isMain = true;
      }

      // Revoke the object URL to free memory
      URL.revokeObjectURL(images[index].preview);

      onChange(newImages);
      setError(null);
    },
    [images, onChange]
  );

  const setMainImage = useCallback(
    (index: number) => {
      console.log("Setting main image to index:", index);
      const newImages = images.map((img, i) => ({
        ...img,
        isMain: i === index,
      }));
      onChange(newImages);
    },
    [images, onChange]
  );

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors",
          isDragging
            ? "border-gray-900 bg-gray-50"
            : "border-gray-300 hover:border-gray-400",
          "cursor-pointer"
        )}
      >
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Upload
            className={cn(
              "w-12 h-12 mb-4 transition-colors",
              isDragging ? "text-gray-900" : "text-gray-400"
            )}
          />
          <p className="text-lg font-medium text-gray-700 mb-1">
            {isDragging ? "Drop images here" : "Drag & drop images here"}
          </p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("image-upload")?.click()}
            className="relative z-20"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Browse Files
          </Button>
          <p className="text-xs text-gray-400 mt-4">
            Maximum {maxImages} images, up to {maxSize}MB each
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Uploaded Images ({images.length}/{maxImages})
            </p>
            <p className="text-xs text-gray-500">
              Click on an image to set it as the main product image
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full min-w-0">
            {images.map((image, index) => (
              <div
                key={`${image.file.name}-${index}`}
                className={cn(
                  "relative group rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
                  image.isMain
                    ? "border-green-500 ring-2 ring-green-200"
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => setMainImage(index)}
              >
                {/* Image Container */}
                <div className="relative w-full aspect-square overflow-hidden">
                  <img
                    src={image.preview}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center pointer-events-none">
                    {!image.isMain && (
                      <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Set as Main
                      </span>
                    )}
                  </div>

                  {/* Main Badge */}
                  {image.isMain && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 pointer-events-none">
                      <CheckCircle2 className="w-3 h-3" />
                      Main
                    </div>
                  )}

                  {/* File Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 pointer-events-none">
                    <p className="text-white text-xs truncate">
                      {image.file.name}
                    </p>
                    <p className="text-white/90 text-xs">
                      {(image.file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
