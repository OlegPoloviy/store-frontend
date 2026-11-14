export type Scene = "studio" | "kitchen" | "bathroom" | "living" | "custom";

export interface BoardItem {
  uniqueId: string;
  productId?: string;
  title: string;
  imageUrl: string;
  originalImageUrl?: string;
  price?: string;
  isUpload?: boolean;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  z: number;
}

export const CARD_WIDTH = 216;
export const CARD_HEIGHT = 256;
