import { type CartItemApi } from "@/api/cart.api";
import { type CartItemVM } from "@/types/cart-item.type";

export function toNumber(val: unknown): number | null {
  if (typeof val === "number" && Number.isFinite(val)) return val;
  if (typeof val === "string") {
    const n = Number(val);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function toNonEmptyString(val: unknown): string | null {
  if (typeof val !== "string") return null;
  const v = val.trim();
  return v.length ? v : null;
}

export function uniqueStrings(
  values: Array<string | null | undefined>
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const v of values) {
    if (!v) continue;
    const key = v.trim();
    if (!key) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(key);
  }
  return out;
}

export function formatDimensions(product: any): string | null {
  // Prefer explicit combined field if backend provides it
  const direct =
    toNonEmptyString(product?.dimensions) ?? toNonEmptyString(product?.size);
  if (direct) return direct;

  const width = toNonEmptyString(product?.width);
  const depth = toNonEmptyString(product?.depth);
  const height = toNonEmptyString(product?.height);
  const unit = toNonEmptyString(product?.unitOfMeasure) ?? "cm";

  const parts = [width, depth, height].filter(Boolean) as string[];
  if (parts.length === 0) return null;

  return `${parts.join(" x ")} ${unit}`;
}

export function pickProductionTime(product: any): string | null {
  return (
    toNonEmptyString(product?.leadTime) ??
    toNonEmptyString(product?.productionTime) ??
    toNonEmptyString(product?.manufacturingTime) ??
    toNonEmptyString(product?.production_time) ??
    null
  );
}

export function mapCartItem(item: CartItemApi): CartItemVM {
  const title = item.product?.title ?? "Product";
  const currency = item.product?.currency ?? "USD";
  const price =
    toNumber(item.priceSnapshot) ?? toNumber(item.product?.price) ?? 0;

  const imageUrl =
    (item.product?.images?.[0] as any)?.url ?? // images are typed, but product is Partial<>
    null;

  const p: any = item.product ?? {};
  const materials = uniqueStrings([
    toNonEmptyString(p.material),
    toNonEmptyString(p.color),
    toNonEmptyString(p.primaryMaterial),
    ...(Array.isArray(p.secondaryMaterials)
      ? p.secondaryMaterials.map(toNonEmptyString)
      : []),
  ]);

  const productionTime = pickProductionTime(p);
  const dimensions = formatDimensions(p);

  return {
    id: item.id,
    productId: item.productId,
    title,
    price,
    currency,
    imageUrl,
    quantity: item.quantity ?? 1,
    materials,
    productionTime,
    dimensions,
  };
}
