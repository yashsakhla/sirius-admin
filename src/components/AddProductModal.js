import { useEffect, useState } from 'react';
import { useGlobalData } from '../context/GlobalDataContext'; // ➕ Adjust the import path if needed

export default function AddProductModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    discountedPrice: '',
    size: '20ml',
    category: '',
  });

  const sizes = ['20ml', '60ml', '100ml'];

  const { data, loadDataIfNeeded } = useGlobalData();
  const categories = data.categories || [];

  // 🔁 Load categories when modal appears
  useEffect(() => {
    loadDataIfNeeded('categories');
  }, []);

  // 👉 Set default category when categories load
  useEffect(() => {
    if (categories.length && !form.category) {
      setForm((prev) => ({
        ...prev,
        category: categories[0].name || categories[0],
      }));
    }
  }, [categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.image || !form.discountedPrice) {
      return alert('Fill all fields');
    }

    onAdd({ ...form, discountedPrice: parseFloat(form.discountedPrice), active: true });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-xl">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>

        <div className="space-y-3">
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />

          <select
            name="size"
            value={form.size}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            {sizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat._id || cat} value={cat.name || cat}>
                  {cat.name || cat}
                </option>
              ))
            ) : (
              <option disabled>Loading categories...</option>
            )}
          </select>

          <input
            name="discountedPrice"
            type="number"
            placeholder="Price ₹"
            value={form.discountedPrice}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <input
            name="image"
            placeholder="Product Image URL"
            value={form.image}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
