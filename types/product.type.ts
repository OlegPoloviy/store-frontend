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
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  material: string | null;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category: ProductCategory;
  images: ProductImage[];
}
