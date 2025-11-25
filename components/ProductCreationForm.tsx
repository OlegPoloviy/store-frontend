"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Package,
  DollarSign,
  Ruler,
  Palette,
  Info,
  Wrench,
  Sparkles,
  Plus,
  X,
} from "lucide-react";
import {
  productCreationSchema,
  ProductCreationFormData,
} from "@/schemas/product.schema";
import { productsApi } from "@/api/productApi";
import { categoryApi } from "@/api/category.api";
import { ProductCategory } from "@/types/product.type";
import { ImageDropzone, ImageFile } from "@/components/ImageDropzone";

export function ProductCreationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [featureInput, setFeatureInput] = useState("");
  const [craftInput, setCraftInput] = useState("");
  const [materialInput, setMaterialInput] = useState("");
  const [productImages, setProductImages] = useState<ImageFile[]>([]);

  const router = useRouter();

  const form = useForm<ProductCreationFormData>({
    resolver: zodResolver(productCreationSchema),
    mode: "onChange",
    defaultValues: {
      currency: "USD",
      unitOfMeasure: "cm",
      weightUnit: "kg",
      handmade: false,
      assemblyRequired: false,
      features: [],
      craftsmanshipDetails: [],
      secondaryMaterials: [],
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll();
        setCategories(data as ProductCategory[]);
      } catch (error) {
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data: ProductCreationFormData) => {
    try {
      setIsLoading(true);

      // Validate images
      if (productImages.length === 0) {
        toast.error("Please add at least one product image");
        setIsLoading(false);
        return;
      }

      // Find the selected category name
      const selectedCategory = categories.find(
        (cat) => cat.id === data.categoryId
      );
      if (!selectedCategory) {
        toast.error("Please select a valid category");
        setIsLoading(false);
        return;
      }

      // Prepare product data object (excluding categoryId, replacing with category name)
      const productData: Record<string, any> = {};

      Object.entries(data).forEach(([key, value]) => {
        if (key === "categoryId") {
          // Replace categoryId with category name
          productData.category = selectedCategory.name;
        } else if (
          value !== undefined &&
          value !== "" &&
          !(Array.isArray(value) && value.length === 0)
        ) {
          productData[key] = value;
        }
      });

      // Create FormData with product data as JSON string
      const formData = new FormData();

      // Add product data as a JSON string
      formData.append("data", JSON.stringify(productData));

      // Add image files separately
      productImages.forEach((img) => {
        formData.append("images", img.file);
      });

      // Log for debugging
      console.log("=== Product Submission Debug ===");
      console.log("Product Data (as JSON):", productData);
      console.log("Number of images:", productImages.length);
      console.log(
        "Image files:",
        productImages.map((img) => ({
          name: img.file.name,
          type: img.file.type,
          size: img.file.size,
          isMain: img.isMain,
        }))
      );

      // Send to backend
      await productsApi.createProduct(formData);

      toast.success("Product created successfully!");

      // Clean up image URLs
      productImages.forEach((img) => URL.revokeObjectURL(img.preview));

      router.push("/products-managment");
    } catch (error: any) {
      console.error("Product creation error:", error);
      toast.error(error.message || "Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  const addToArray = (
    fieldName: "features" | "craftsmanshipDetails" | "secondaryMaterials",
    value: string,
    setter: (val: string) => void
  ) => {
    if (!value.trim()) return;

    const currentValues = form.getValues(fieldName) || [];
    form.setValue(fieldName, [...currentValues, value.trim()]);
    setter("");
  };

  const removeFromArray = (
    fieldName: "features" | "craftsmanshipDetails" | "secondaryMaterials",
    index: number
  ) => {
    const currentValues = form.getValues(fieldName) || [];
    form.setValue(
      fieldName,
      currentValues.filter((_, i) => i !== index)
    );
  };

  return (
    <Card className="shadow-lg border-0 max-w-5xl mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-semibold text-gray-900">
          Create New Product
        </CardTitle>
        <CardDescription className="text-gray-600">
          Fill in the details to add a new product to your store
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 lg:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Basic Information
              </h3>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Enter product description"
                        className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <FormControl>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                          {...field}
                          disabled={loadingCategories}
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="uniqueIdentifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU / Product Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., PROD-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Product Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Product Images
              </h3>
              <ImageDropzone
                images={productImages}
                onChange={setProductImages}
                maxImages={10}
                maxSize={5}
              />
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Pricing
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price *</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="99.99" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter price in decimal format
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency *</FormLabel>
                      <FormControl>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                          {...field}
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="CAD">CAD</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Dimensions & Weight */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Ruler className="w-5 h-5 mr-2" />
                Dimensions & Weight
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Width</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 120" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 80" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Depth</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 60" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unitOfMeasure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                          {...field}
                        >
                          <option value="cm">cm</option>
                          <option value="in">in</option>
                          <option value="mm">mm</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 15.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weightUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight Unit</FormLabel>
                      <FormControl>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                          {...field}
                        >
                          <option value="kg">kg</option>
                          <option value="lb">lb</option>
                          <option value="g">g</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Materials & Style */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Materials & Style
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primaryMaterial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Material</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Oak Wood" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Natural Brown" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Style</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Modern, Rustic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="finish"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Finish</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Matte, Glossy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pattern"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pattern</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Striped, Solid" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="texture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texture</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Smooth, Rough" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Secondary Materials Array */}
              <div className="space-y-2">
                <FormLabel>Secondary Materials</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add secondary material"
                    value={materialInput}
                    onChange={(e) => setMaterialInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addToArray(
                          "secondaryMaterials",
                          materialInput,
                          setMaterialInput
                        );
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      addToArray(
                        "secondaryMaterials",
                        materialInput,
                        setMaterialInput
                      )
                    }
                    size="icon"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(form.watch("secondaryMaterials") || []).map(
                    (material, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{material}</span>
                        <button
                          type="button"
                          onClick={() =>
                            removeFromArray("secondaryMaterials", index)
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Manufacturing & Origin */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Manufacturing & Origin
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="handmade"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Handmade Product</FormLabel>
                        <FormDescription>
                          Check if this product is handcrafted
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="designer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designer</FormLabel>
                      <FormControl>
                        <Input placeholder="Designer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="originOfMaterial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin of Material</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Italy, Germany" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="woodTreatment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wood Treatment</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Varnished, Oil-treated"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Craftsmanship Details Array */}
              <div className="space-y-2">
                <FormLabel>Craftsmanship Details</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add craftsmanship detail"
                    value={craftInput}
                    onChange={(e) => setCraftInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addToArray(
                          "craftsmanshipDetails",
                          craftInput,
                          setCraftInput
                        );
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      addToArray(
                        "craftsmanshipDetails",
                        craftInput,
                        setCraftInput
                      )
                    }
                    size="icon"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(form.watch("craftsmanshipDetails") || []).map(
                    (detail, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{detail}</span>
                        <button
                          type="button"
                          onClick={() =>
                            removeFromArray("craftsmanshipDetails", index)
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Features & Capacity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Features & Capacity
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="seatingCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seating Capacity</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 4 people" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storageCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage Capacity</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 3 drawers" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Features Array */}
              <div className="space-y-2">
                <FormLabel>Product Features</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a feature"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addToArray("features", featureInput, setFeatureInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      addToArray("features", featureInput, setFeatureInput)
                    }
                    size="icon"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(form.watch("features") || []).map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFromArray("features", index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Care & Assembly */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Wrench className="w-5 h-5 mr-2" />
                Care & Assembly
              </h3>

              <FormField
                control={form.control}
                name="careInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Care Instructions</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="How to care for this product..."
                        className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="assemblyRequired"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assembly Required</FormLabel>
                      <FormControl>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                          value={field.value ? "true" : "false"}
                          onChange={(e) =>
                            field.onChange(e.target.value === "true")
                          }
                        >
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warranty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2 years" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Story & Design */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Story & Design
              </h3>

              <FormField
                control={form.control}
                name="story"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Story</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Tell the story behind this product..."
                        className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="designInspiration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Design Inspiration</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="What inspired this design..."
                        className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Product...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>Create Product</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
