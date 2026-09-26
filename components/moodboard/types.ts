export type Scene = "studio" | "kitchen" | "bathroom" | "living" | "custom";

export interface BoardItem {
  uniqueId: string;
  productId?: string;
  title: string;
  imageUrl: string;
  price?: string;
  isUpload?: boolean;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  z: number;
}

export const CARD_WIDTH = 176;
export const CARD_HEIGHT = 216;
