import { productsApi } from "@/api/productApi";
import { Product } from "@/types/product.type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FooterSection } from "@/components/FooterSection";
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  Award,
  Palette,
  Ruler,
  Package,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";

interface ProductPageProps {
  params: { productId: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await productsApi.getById(params.productId);

  const formatPrice = (price: string, currency: string) => {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: currency,
    }).format(parseInt(price));
  };

  const renderSpecification = (
    label: string,
    value: string | string[] | null | undefined,
    icon?: React.ReactNode
  ) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;

    return (
      <div className="flex items-start space-x-3 py-2">
        {icon && <div className="text-gray-500 mt-1">{icon}</div>}
        <div className="flex-1">
          <dt className="text-sm font-medium text-gray-900">{label}</dt>
          <dd className="text-sm text-gray-600">
            {Array.isArray(value) ? value.join(", ") : value}
          </dd>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-700">
              Products
            </Link>
            <span>/</span>
            <Link
              href={`/categories/${product.category.name.toLowerCase()}`}
              className="hover:text-gray-700"
            >
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0].url}
                    alt={product.title}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                    <Package className="w-16 h-16 mb-4" />
                    <p className="text-lg font-medium">No Image Available</p>
                    <p className="text-sm text-center px-4">
                      Image will be added soon
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Images */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm"
                    >
                      <Image
                        src={image.url}
                        alt={`${product.title} ${index + 2}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category Badge */}
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {product.category.name}
              </Badge>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.handmade && (
                  <Badge
                    variant="outline"
                    className="text-amber-600 border-amber-600"
                  >
                    <Award className="w-3 h-3 mr-1" />
                    Handmade
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  size="lg"
                  className="flex-1 bg-gray-900 hover:bg-gray-800"
                >
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" className="px-4">
                  <Heart className="w-5 h-5" />
                </Button>
                <CopyButton />
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>Careful Packaging</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Award className="w-4 h-4" />
                  <span>Quality Guarantee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Product Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Ruler className="w-5 h-5 mr-2" />
                  Specifications
                </h3>
                <dl className="space-y-1">
                  {renderSpecification(
                    "Dimensions",
                    [product.width, product.height, product.depth]
                      .filter(Boolean)
                      .join(" × "),
                    <Ruler className="w-4 h-4" />
                  )}
                  {renderSpecification(
                    "Weight",
                    product.weight
                      ? `${product.weight} ${product.weightUnit || "kg"}`
                      : null,
                    <Package className="w-4 h-4" />
                  )}
                  {renderSpecification(
                    "Primary Material",
                    product.primaryMaterial,
                    <Palette className="w-4 h-4" />
                  )}
                  {renderSpecification(
                    "Secondary Materials",
                    product.secondaryMaterials,
                    <Palette className="w-4 h-4" />
                  )}
                  {renderSpecification(
                    "Color",
                    product.color,
                    <Palette className="w-4 h-4" />
                  )}
                  {renderSpecification(
                    "Finish",
                    product.finish,
                    <Palette className="w-4 h-4" />
                  )}
                  {renderSpecification(
                    "Style",
                    product.style,
                    <Palette className="w-4 h-4" />
                  )}
                  {renderSpecification(
                    "Texture",
                    product.texture,
                    <Palette className="w-4 h-4" />
                  )}
                  {renderSpecification(
                    "Pattern",
                    product.pattern,
                    <Palette className="w-4 h-4" />
                  )}
                </dl>
              </div>

              {/* Additional Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Information
                </h3>
                <dl className="space-y-1">
                  {renderSpecification("Designer", product.designer)}
                  {renderSpecification(
                    "Origin of Material",
                    product.originOfMaterial
                  )}
                  {renderSpecification("Wood Treatment", product.woodTreatment)}
                  {renderSpecification(
                    "Assembly Required",
                    product.assemblyRequired
                  )}
                  {renderSpecification(
                    "Seating Capacity",
                    product.seatingCapacity
                  )}
                  {renderSpecification(
                    "Storage Capacity",
                    product.storageCapacity
                  )}
                  {renderSpecification("Warranty", product.warranty)}
                  {renderSpecification(
                    "Care Instructions",
                    product.careInstructions
                  )}
                </dl>
              </div>
            </div>

            {/* Features and Story */}
            {product.features && product.features.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Features
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-gray-600"
                    >
                      <Star className="w-4 h-4 text-amber-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.story && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  The Story
                </h3>
                <p className="text-gray-600 leading-relaxed">{product.story}</p>
              </div>
            )}

            {product.designInspiration && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Design Inspiration
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.designInspiration}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
