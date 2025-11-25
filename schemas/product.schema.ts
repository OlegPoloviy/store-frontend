import { z } from "zod";

export const productCreationSchema = z.object({
  title: z.string().min(3, "Product title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number"),
  currency: z.string().min(1, "Currency is required"),
  categoryId: z.string().min(1, "Category is required"),

  // Images - will be handled separately as File objects
  images: z.array(z.any()).optional(),

  // Basic product details
  material: z.string().optional(),
  color: z.string().optional(),
  style: z.string().optional(),

  // Dimensions
  width: z.string().optional(),
  height: z.string().optional(),
  depth: z.string().optional(),
  unitOfMeasure: z.string().optional(),

  // Weight
  weight: z.string().optional(),
  weightUnit: z.string().optional(),

  // Additional details
  primaryMaterial: z.string().optional(),
  secondaryMaterials: z.array(z.string()).optional(),
  finish: z.string().optional(),
  pattern: z.string().optional(),
  texture: z.string().optional(),

  // Manufacturing & Origin
  handmade: z.boolean().optional(),
  designer: z.string().optional(),
  originOfMaterial: z.string().optional(),
  craftsmanshipDetails: z.array(z.string()).optional(),

  // Features & Capacity
  features: z.array(z.string()).optional(),
  seatingCapacity: z.string().optional(),
  storageCapacity: z.string().optional(),

  // Care & Assembly
  careInstructions: z.string().optional(),
  assemblyRequired: z.boolean().optional(),
  warranty: z.string().optional(),

  // Story & Design
  story: z.string().optional(),
  designInspiration: z.string().optional(),

  // Wood-specific
  woodTreatment: z.string().optional(),

  // Identifiers
  uniqueIdentifier: z.string().optional(),
});

export type ProductCreationFormData = z.infer<typeof productCreationSchema>;
