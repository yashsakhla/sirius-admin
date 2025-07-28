import { useEffect, useState } from "react";
import {
  createCategory,
  updateCategory as updateCategoryApi,
  setAuthToken,
} from "../api";
import { useGlobalData } from "../context/GlobalDataContext";

export default function Category() {
  const { data, loading, loadDataIfNeeded, refreshData } = useGlobalData();

  const [productsCount] = useState({
    "Essential Oil": 10,
    "Extract": 5,
    "Skincare": 7,
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const categories = data.categories;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    
    // ⚡ Lazy load categories from global store
    loadDataIfNeeded("categories");
  }, []);

  const handleAddCategory = async () => {
    const trimmed = newCategory.trim();

    if (!trimmed) {
      alert("Category name is required.");
      return;
    }

    const exists = categories?.some(
      (cat) => cat.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      alert("This category already exists.");
      return;
    }

    try {
      await createCategory(trimmed);
      setNewCategory("");
      setShowAddModal(false);
      refreshData("categories"); // 🔄 Re-fetch after adding
    } catch (err) {
      console.error("Create category failed:", err.message);
      alert(err?.response?.data?.message || "Failed to add category.");
    }
  };

  const handleEditCategory = async () => {
    const trimmed = newCategory.trim();

    if (!trimmed) {
      alert("Category name is required.");
      return;
    }

    const exists = categories?.some(
      (cat) =>
        cat.name.toLowerCase() === trimmed.toLowerCase() &&
        cat._id !== editingCategory._id
    );

    if (exists) {
      alert("Another category with this name already exists.");
      return;
    }

    try {
      await updateCategoryApi(editingCategory._id, trimmed);
      setNewCategory("");
      setShowEditModal(false);
      setEditingCategory(null);
      refreshData("categories"); // 🔁 Refresh after updating
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update category.");
    }
  };

  if (loading.categories && !categories) return <p>Loading categories...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          + Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Category Name</th>
              <th className="px-4 py-2">No. of Products</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((cat, idx) => (
              <tr key={cat._id} className="border-t">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{cat.name}</td>
                <td className="px-4 py-2 text-center">
                  {productsCount[cat.name] || 0}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setNewCategory(cat.name);
                      setShowEditModal(true);
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold mb-4">Add Category</h2>
            <input
              type="text"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded focus:outline-none focus:ring focus:ring-blue-400"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold mb-4">Edit Category</h2>
            <input
              type="text"
              placeholder="Enter new name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full border px-3 py-2 mb-4 rounded focus:outline-none focus:ring focus:ring-yellow-400"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCategory(null);
                  setNewCategory("");
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCategory}
                className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
