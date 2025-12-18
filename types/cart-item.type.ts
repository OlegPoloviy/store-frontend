export interface CartItemVM {
  id: string;
  productId: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string | null;
  quantity: number;
  materials: string[];
  productionTime: string | null;
  dimensions: string | null;
  total?: number;
  shippingPrice?: number;
}
