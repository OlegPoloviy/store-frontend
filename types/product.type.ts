export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  isMain: boolean;
  createdAt: string;
  productId: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  categoryImage?: string;
}

export interface Product {
  id: string;
  sku?: string | null;
  title: string;
  description: string;
  price: string;
  currency: string;
  convertedPrices?: {
    source: "NBU";
    date: string;
    baseAmount: string;
    prices: Record<"USD" | "EUR", {
      amount: string;
      originalAmount: string | null;
      rate: string;
    }>;
  } | null;
  material: string | null;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category: ProductCategory;
  images: ProductImage[];
  isFavorite?: boolean;
  availability?: "IN_STOCK" | "OUT_OF_STOCK" | "PREORDER" | "BACKORDER" | null;
  isMadeToOrder?: boolean;
  estimatedDispatch?: {
    earliestDate: string;
    latestDate: string;
  } | null;

  // Additional detailed fields
  assemblyRequired?: string | null;
  careInstructions?: string | null;
  color?: string | null;
  craftsmanshipDetails?: string[];
  creationDate?: string | null;
  depth?: string | null;
  designInspiration?: string | null;
  designer?: string | null;
  features?: string[];
  finish?: string | null;
  handmade?: boolean;
  height?: string | null;
  originOfMaterial?: string | null;
  pattern?: string | null;
  primaryMaterial?: string | null;
  seatingCapacity?: string | null;
  secondaryMaterials?: string[];
  storageCapacity?: string | null;
  story?: string | null;
  style?: string | null;
  texture?: string | null;
  uniqueIdentifier?: string | null;
  unitOfMeasure?: string | null;
  warranty?: string | null;
  weight?: string | null;
  weightUnit?: string | null;
  width?: string | null;
  woodTreatment?: string | null;
}
