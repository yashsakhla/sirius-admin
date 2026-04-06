/** Canonical size options and stable sort order for product variants */
export const SIZE_OPTIONS = ["20ml", "50ml", "100ml"];

export function sortSizeVariants(variants) {
  return [...variants].sort(
    (a, b) =>
      SIZE_OPTIONS.indexOf(a.size) - SIZE_OPTIONS.indexOf(b.size)
  );
}

/**
 * Prefer API field `size` (array of variants or legacy string list);
 * fall back to old `sizes` if present.
 */
export function productSizeVariantList(product) {
  if (Array.isArray(product.size) && product.size.length) {
    return product.size;
  }
  if (Array.isArray(product.sizes) && product.sizes.length) {
    return product.sizes;
  }
  return null;
}

/**
 * Build initial variant rows for forms: { size, basicPrice, discountedPrice } (string inputs).
 * Supports legacy variant `price` and product-level discountedPrice.
 */
export function productToSizeVariants(product) {
  const fallbackBasic = String(product.price ?? "");
  const fallbackDiscounted = String(product.discountedPrice ?? "");

  const list = productSizeVariantList(product);
  if (list) {
    const first = list[0];
    if (typeof first === "object" && first !== null && "size" in first) {
      return list.map((s) => ({
        size: s.size,
        basicPrice: String(s.basicPrice ?? s.price ?? fallbackBasic ?? ""),
        discountedPrice: String(s.discountedPrice ?? s.discountPrice ?? ""),
      }));
    }
    return list.map((size) => ({
      size,
      basicPrice: fallbackBasic,
      discountedPrice: fallbackDiscounted,
    }));
  }

  if (typeof product.size === "string" && product.size.trim()) {
    return [
      {
        size: product.size,
        basicPrice: fallbackBasic,
        discountedPrice: fallbackDiscounted,
      },
    ];
  }

  return [];
}

export function formatProductSizesDisplay(product) {
  const list = productSizeVariantList(product);
  if (list) {
    const first = list[0];
    if (typeof first === "object" && first !== null && "size" in first) {
      return list.map((s) => s.size).join(", ");
    }
    return list.join(", ");
  }
  if (typeof product.size === "string" && product.size.trim()) {
    return product.size;
  }
  return "";
}

function variantPriceLabel(s) {
  const basic = s.basicPrice ?? s.price;
  const discounted = s.discountedPrice ?? s.discountPrice;
  if (discounted != null && discounted !== "" && basic != null && basic !== "") {
    return `${s.size}: ₹${discounted} (₹${basic})`;
  }
  if (discounted != null && discounted !== "") {
    return `${s.size}: ₹${discounted}`;
  }
  if (basic != null && basic !== "") {
    return `${s.size}: ₹${basic}`;
  }
  return `${s.size}: —`;
}

export function formatProductPriceDisplay(product) {
  const list = productSizeVariantList(product);
  if (list && typeof list[0] === "object" && list[0] !== null && "size" in list[0]) {
    const first = list[0];
    if (
      "basicPrice" in first ||
      "discountedPrice" in first ||
      "price" in first
    ) {
      return list.map(variantPriceLabel).join(", ");
    }
  }
  if (product.discountedPrice != null && product.discountedPrice !== "") {
    return `₹${product.discountedPrice}`;
  }
  return "—";
}
