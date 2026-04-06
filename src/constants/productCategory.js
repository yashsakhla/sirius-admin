/**
 * Product listing kind (separate from fragrance `category` string).
 *
 * Payload shape on create/update:
 *   productCategory: {
 *     type: "single" | "gift",
 *     allowsCustomerProductChoice: boolean  // true only for gift — end customer picks products
 *   }
 */
export const PRODUCT_CATEGORY_TYPE = {
  SINGLE: "single",
  GIFT: "gift",
};

export function buildProductCategoryPayload(type) {
  const isGift = type === PRODUCT_CATEGORY_TYPE.GIFT;
  return {
    type: isGift ? PRODUCT_CATEGORY_TYPE.GIFT : PRODUCT_CATEGORY_TYPE.SINGLE,
    allowsCustomerProductChoice: isGift,
  };
}

export function productCategoryTypeFromProduct(product) {
  const t = product?.productCategory?.type;
  if (t === PRODUCT_CATEGORY_TYPE.GIFT) return PRODUCT_CATEGORY_TYPE.GIFT;
  return PRODUCT_CATEGORY_TYPE.SINGLE;
}

export function formatProductCategoryLabel(product) {
  return productCategoryTypeFromProduct(product) === PRODUCT_CATEGORY_TYPE.GIFT
    ? "Gift"
    : "Single";
}
