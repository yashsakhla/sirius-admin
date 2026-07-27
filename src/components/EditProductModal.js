// src/components/EditProductModal.js

import React, { useEffect, useMemo, useState } from "react";
import { uploadImagesToImgbb } from "../api";
import {
  SIZE_OPTIONS,
  productToSizeVariants,
  sortSizeVariants,
} from "../constants/productSizes";
import {
  PRODUCT_CATEGORY_TYPE,
  buildProductCategoryPayload,
  productCategoryTypeFromProduct,
} from "../constants/productCategory";
export default function EditProductModal({ product, onClose, onSave }) {
  const initialImages = Array.isArray(product.images) && product.images.length
    ? product.images
    : (product.image ? [product.image] : []);

  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    productCategoryType: productCategoryTypeFromProduct(product),
  });
  const [sizeVariants, setSizeVariants] = useState(() =>
    productToSizeVariants(product)
  );
  const [images, setImages] = useState(initialImages);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const previews = useMemo(
    () => imageFiles.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    [imageFiles]
  );

  const orderedVariants = useMemo(
    () => sortSizeVariants(sizeVariants),
    [sizeVariants]
  );

  // Gift listing: only one size allowed — trim when switching to Gift
  useEffect(() => {
    if (form.productCategoryType !== PRODUCT_CATEGORY_TYPE.GIFT) return;
    setSizeVariants((prev) => {
      if (prev.length <= 1) return prev;
      return [sortSizeVariants(prev)[0]];
    });
  }, [form.productCategoryType]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "radio" && name === "productCategoryType") {
      setForm((prev) => ({ ...prev, productCategoryType: value }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImageFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeExistingImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeSelectedFile = (idx) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleSize = (size) => {
    const isGift = form.productCategoryType === PRODUCT_CATEGORY_TYPE.GIFT;
    setSizeVariants((prev) => {
      const exists = prev.some((v) => v.size === size);
      if (isGift) {
        if (exists) return [];
        return [{ size, basicPrice: "", discountedPrice: "", qty: "" }];
      }
      if (exists) return prev.filter((v) => v.size !== size);
      return [...prev, { size, basicPrice: "", discountedPrice: "", qty: "" }];
    });
  };

  const setVariantField = (sizeLabel, field, value) => {
    setSizeVariants((prev) =>
      prev.map((v) => (v.size === sizeLabel ? { ...v, [field]: value } : v))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError("");

    if (!sizeVariants.length) {
      return alert("Select at least one size.");
    }

    const sizePayload = sizeVariants.map((v) => ({
      size: v.size,
      basicPrice: parseFloat(v.basicPrice),
      discountedPrice: parseFloat(v.discountedPrice),
      qty: parseInt(v.qty, 10),
    }));

    if (
      sizePayload.some(
        (s) =>
          Number.isNaN(s.basicPrice) ||
          s.basicPrice < 0 ||
          Number.isNaN(s.discountedPrice) ||
          s.discountedPrice < 0 ||
          Number.isNaN(s.qty) ||
          s.qty < 0
      )
    ) {
      return alert(
        "Enter a valid basic price, discounted price (₹), and quantity for each selected size."
      );
    }

    try {
      setUploading(true);
      let uploadedUrls = [];
      if (imageFiles.length) {
        uploadedUrls = await uploadImagesToImgbb(imageFiles);
      }

      const mergedImages = [...images, ...uploadedUrls].filter(Boolean);

      if (!mergedImages.length) {
        setUploading(false);
        return alert("Please keep at least one image.");
      }

      const {
        discountedPrice: _legacyPrice,
        size: _legacySize,
        sizes: _legacySizes,
        image: _legacyImage,
        productCategory: _legacyProductCategory,
        ...productRest
      } = product;

      onSave({
        ...productRest,
        name: form.name,
        description: form.description,
        productCategory: buildProductCategoryPayload(form.productCategoryType),
        size: sizePayload,
        images: mergedImages,
      });
    } catch (e2) {
      console.error("Image upload failed:", e2);
      setUploadError(e2?.response?.data?.error?.message || e2?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-panel max-w-md">
        <div className="modal-header">
          <h2 className="text-lg font-bold text-gray-900">Edit Product</h2>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div>
            <label className="field-label">Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input-field"
              rows={2}
            />
          </div>
          <div>
            <label className="field-label">Product category</label>
            <div className="border border-gray-200 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-600 mb-2">
                Single is a normal product. Gift lets the customer choose which products go in the gift.
              </p>
              <div className="flex flex-col gap-2">
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="productCategoryType"
                    value={PRODUCT_CATEGORY_TYPE.SINGLE}
                    checked={form.productCategoryType === PRODUCT_CATEGORY_TYPE.SINGLE}
                    onChange={handleChange}
                    disabled={uploading}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="font-medium">Single</span>
                    <span className="text-gray-600"> — fixed product</span>
                  </span>
                </label>
                <label className="flex items-start gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="productCategoryType"
                    value={PRODUCT_CATEGORY_TYPE.GIFT}
                    checked={form.productCategoryType === PRODUCT_CATEGORY_TYPE.GIFT}
                    onChange={handleChange}
                    disabled={uploading}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="font-medium">Gift</span>
                    <span className="text-gray-600">
                      {" "}
                      — customer enters their own product choice
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div>
            <label className="field-label">Sizes & prices</label>
            <div className="border border-gray-200 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-600 mb-2">
                {form.productCategoryType === PRODUCT_CATEGORY_TYPE.GIFT
                  ? "Gift products: choose one size only, then enter prices and quantity."
                  : "Check one or more sizes, then enter basic (MRP) price, discounted price, and quantity for each."}
              </p>
              <div className="flex flex-wrap gap-3 mb-3">
                {SIZE_OPTIONS.map((size) => {
                  const checked = sizeVariants.some((v) => v.size === size);
                  return (
                    <label key={size} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSize(size)}
                        disabled={uploading}
                      />
                      <span>{size}</span>
                    </label>
                  );
                })}
              </div>
              {!!orderedVariants.length && (
                <div className="space-y-3 border-t pt-3">
                  {orderedVariants.map((v) => (
                    <div key={v.size} className="space-y-1">
                      <span className="text-sm font-medium">{v.size}</span>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Basic price ₹"
                          value={v.basicPrice}
                          onChange={(e) =>
                            setVariantField(v.size, "basicPrice", e.target.value)
                          }
                          className="input-field flex-1"
                          disabled={uploading}
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Discounted price ₹"
                          value={v.discountedPrice}
                          onChange={(e) =>
                            setVariantField(
                              v.size,
                              "discountedPrice",
                              e.target.value
                            )
                          }
                          className="input-field flex-1"
                          disabled={uploading}
                        />
                        <input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="Quantity"
                          value={v.qty}
                          onChange={(e) =>
                            setVariantField(v.size, "qty", e.target.value)
                          }
                          className="input-field flex-1"
                          disabled={uploading}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="field-label">Product Image</label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="input-field file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700"
                disabled={uploading}
              />

              {!!images.length && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((url, idx) => (
                    <div key={`${url}-${idx}`} className="relative">
                      <img
                        src={url}
                        alt={`#${idx + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded"
                        disabled={uploading}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {!!previews.length && (
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((p, idx) => (
                    <div key={p.url} className="relative">
                      <img
                        src={p.url}
                        alt={`Selected ${idx + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(idx)}
                        className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded"
                        disabled={uploading}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploadError ? (
                <p className="text-sm text-red-600">{uploadError}</p>
              ) : uploading ? (
                <p className="text-sm text-gray-600">Uploading images...</p>
              ) : null}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
