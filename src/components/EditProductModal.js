// src/components/EditProductModal.js

import React, { useState, useRef } from "react";

export default function EditProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    discountedPrice: product.discountedPrice,
    image: product.image || "",
    imageFile: null, // For uploaded new image
  });

  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      image: URL.createObjectURL(file), // Preview
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, send imageFile to backend if uploading to server
    // or pass back to parent for further processing
    onSave({ ...product, ...form });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-xl">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              rows={2}
            />
          </div>
          {/* Price */}
          <div>
            <label className="block font-medium mb-1">Price (₹)</label>
            <input
              name="discountedPrice"
              type="number"
              value={form.discountedPrice}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          {/* Image Upload with Preview */}
          <div>
            <label className="block font-medium mb-1">Product Image</label>
            <input
            name="image"
            placeholder="Product Image URL"
            value={form.image}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
