import { productsApiServer } from "@/api/productApi.server";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Truck,
  Shield,
  Award,
  Palette,
  Ruler,
  Package,
} from "lucide-react";
import Link from "next/link";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductActions } from "@/components/ProductActions";

interface ProductPageProps {
  params: { productId: string };
}

export default async function ProductPage({
  params: pageParams,
}: ProductPageProps) {
  const params = await pageParams;
  const productId = await params.productId;
  const product = await productsApiServer.getById(productId);

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
            <ProductImageGallery
              images={product.images || []}
              productTitle={product.title}
            />

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
              <div className="text-lg leading-relaxed">
                {product.description ? (
                  <p className="text-gray-600">{product.description}</p>
                ) : (
                  <p className="text-gray-400 italic">
                    No description available yet. Please contact us for more
                    details.
                  </p>
                )}
              </div>

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
              <ProductActions productId={productId} />

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
