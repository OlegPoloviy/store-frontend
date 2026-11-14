import Link from "next/link";
import { ArrowLeft, Award, Check, MessageCircle } from "lucide-react";
import { ProductActions } from "@/components/ProductActions";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { SupportLink } from "@/components/chat/SupportLink";
import { productsApiServer } from "@/lib/api/productApi.server";
import { getServerTranslation } from "@/lib/i18n/server";
import { ProductDescription, productDescriptionText } from "@/lib/util/productDescription";

type Detail = [label: string, value: string | number | string[] | null | undefined];

function present([, value]: Detail) {
  return Array.isArray(value) ? value.some((item) => item.trim()) : value != null && String(value).trim() !== "";
}

export default async function ProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const { t, locale } = await getServerTranslation();
  const { productId } = await params;
  const product = await productsApiServer.getById(productId);
  const category = product.category?.name;
  const categoryLabel = category?.split("/").at(-1)?.trim() || category;
  const categoryHref = category ? `/categories/${encodeURIComponent(category)}` : "/products";
  const price = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: product.currency,
  }).format(Number(product.price));
  const description = productDescriptionText(product.description);
  const dimension = (value?: string | null) => value ? `${value} ${product.unitOfMeasure ?? "cm"}` : null;
  const assembly = product.assemblyRequired;

  const summary: Detail[] = [
    ["Primary Material", product.primaryMaterial || product.material],
    ["Color", product.color],
    ["Finish", product.finish],
    ["SKU", product.sku || product.uniqueIdentifier],
  ];
  const specifications: Detail[] = [
    ["Width", dimension(product.width)],
    ["Height", dimension(product.height)],
    ["Depth", dimension(product.depth)],
    ["Weight", product.weight ? `${product.weight} ${product.weightUnit ?? "kg"}` : null],
    ["Secondary Materials", product.secondaryMaterials],
    ["Style", product.style],
    ["Texture", product.texture],
    ["Pattern", product.pattern],
  ];
  const additional: Detail[] = [
    ["Designer", product.designer],
    ["Origin of Material", product.originOfMaterial],
    ["Wood Treatment", product.woodTreatment],
    ["Assembly Required", assembly == null || assembly === "" ? null : t(String(assembly) === "true" ? "Yes" : "No")],
    ["Seating Capacity", product.seatingCapacity],
    ["Storage Capacity", product.storageCapacity],
    ["Warranty", product.warranty],
    ["Care Instructions", product.careInstructions],
  ];
  const summaryRows = summary.filter(present);
  const groups = [
    { title: "Specifications", rows: specifications.filter(present) },
    { title: "Additional Information", rows: additional.filter(present) },
  ].filter(({ rows }) => rows.length);
  const features = product.features?.filter((value) => value.trim()) ?? [];
  const notes = [
    { title: "The Story", value: product.story },
    { title: "Design Inspiration", value: product.designInspiration },
  ].filter(({ value }) => value?.trim());

  function renderDetails(rows: Detail[]) {
    return rows.map(([label, value]) => (
      <div key={label} className="min-w-0">
        <dt className="text-xs font-medium text-muted-foreground">{t(label)}</dt>
        <dd className="mt-1 break-words text-sm font-medium">{Array.isArray(value) ? value.join(", ") : value}</dd>
      </div>
    ));
  }

  return (
    <main className="min-h-screen bg-background px-4 pb-24 pt-28 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav aria-label={t("Breadcrumb")} className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <Link href="/products" className="inline-flex items-center gap-2 hover:text-foreground">
            <ArrowLeft aria-hidden="true" className="size-4" />{t("Products")}
          </Link>
          {categoryLabel && <>
            <span aria-hidden="true">/</span>
            <Link href={categoryHref} className="hover:text-foreground">{categoryLabel}</Link>
          </>}
        </nav>

        <div className="grid items-start gap-5 lg:grid-cols-[1.12fr_1fr] lg:gap-8">
          <ProductImageGallery key={product.id} images={product.images ?? []} productTitle={product.title} />

          <section aria-labelledby="product-title" className="min-w-0 rounded-[28px] border border-border bg-card p-5 text-card-foreground sm:p-8">
            {product.handmade && (
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                <Award aria-hidden="true" className="size-3.5" />{t("Handmade")}
              </span>
            )}
            <h1 id="product-title" className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{product.title}</h1>
            {description && (
              <div className="mt-4 text-base leading-relaxed">
                <ProductDescription description={product.description} fallback={null} />
              </div>
            )}
            {summaryRows.length > 0 && (
              <dl className="my-5 grid grid-cols-2 gap-x-5 gap-y-4 rounded-2xl bg-muted/55 px-4 py-4">
                {renderDetails(summaryRows)}
              </dl>
            )}

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <p className="text-3xl font-semibold tracking-tight">{price}</p>
              <ProductActions productId={product.id} initialIsFavorite={product.isFavorite} />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">{t("Questions about this product?")}</p>
              <SupportLink className="inline-flex items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline">
                <MessageCircle aria-hidden="true" className="size-4" />{t("Ask our team")}
              </SupportLink>
            </div>
          </section>
        </div>

        {(groups.length > 0 || features.length > 0 || notes.length > 0) && (
          <section aria-labelledby="product-details" className="mt-7 space-y-6 rounded-[28px] border border-border bg-card p-5 sm:p-8 lg:mt-9">
            <h2 id="product-details" className="text-2xl font-semibold tracking-tight">{t("Product Details")}</h2>
            {groups.length > 0 && (
              <div className={groups.length > 1 ? "grid gap-6 lg:grid-cols-2" : "grid gap-6"}>
                {groups.map(({ title, rows }) => (
                  <div key={title} className="rounded-2xl border border-border p-4 sm:p-5">
                    <h3 className="mb-4 font-semibold">{t(title)}</h3>
                    <dl className="grid grid-cols-2 gap-4">{renderDetails(rows)}</dl>
                  </div>
                ))}
              </div>
            )}
            {features.length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold">{t("Features")}</h3>
                <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex gap-2"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            {notes.map(({ title, value }) => (
              <div key={title}>
                <h3 className="mb-2 font-semibold">{t(title)}</h3>
                <ProductDescription description={value} fallback={null} />
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
