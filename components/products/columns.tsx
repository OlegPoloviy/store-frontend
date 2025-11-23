"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types/product.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

interface ColumnsProps {
  onEditAction?: (product: Product) => void;
  onDeleteAction?: (productId: string) => void;
}

export const createProductColumns = ({
  onEditAction,
  onDeleteAction,
}: ColumnsProps = {}): ColumnDef<Product>[] => [
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => {
      const images = row.getValue("images") as Product["images"];
      const mainImage = images?.find((img) => img.isMain) || images?.[0];

      return mainImage ? (
        <div className="relative h-12 w-12 overflow-hidden rounded-md">
          <Image
            src={mainImage.url}
            alt={mainImage.altText || "Product image"}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      ) : (
        <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
          No image
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <div className="max-w-[200px] truncate font-medium">{title}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[300px] truncate text-muted-foreground">
          {description}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price") as string;
      const currency = row.original.currency;
      return (
        <div className="font-semibold">
          {currency} {parseFloat(price).toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as Product["category"];
      return <Badge variant="secondary">{category.name}</Badge>;
    },
  },
  {
    accessorKey: "material",
    header: "Material",
    cell: ({ row }) => {
      const material = row.getValue("material") as string | null;
      return material || <span className="text-muted-foreground">N/A</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return date
        ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A";
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex items-center gap-2">
          {onEditAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditAction(product)}
              title="Edit product"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDeleteAction && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (
                  window.confirm(
                    `Are you sure you want to delete "${product.title}"?`
                  )
                ) {
                  onDeleteAction(product.id);
                }
              }}
              title="Delete product"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];

// Export default columns for backward compatibility
export const productColumns = createProductColumns();
