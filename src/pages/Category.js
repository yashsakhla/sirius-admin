import { useEffect, useState, useRef } from "react";
import {
  createCategory,
  updateCategory as updateCategoryApi,
  deleteCategory as deleteCategoryApi,
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
  const loadDataRef = useRef(loadDataIfNeeded);
  loadDataRef.current = loadDataIfNeeded;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    loadDataRef.current("categories");
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

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteCategoryApi(cat._id);
      refreshData("categories"); // 🔁 Refresh after deleting
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete category.");
    }
  };

  if (loading.categories && !categories) return <p className="p-6 text-gray-500">Loading categories...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">Organize products into browsable categories</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          + Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="table-shell">
        <table className="min-w-full text-left text-sm">
          <thead className="table-head-row">
            <tr>
              <th className="table-cell">#</th>
              <th className="table-cell">Category Name</th>
              <th className="table-cell">No. of Products</th>
              <th className="table-cell">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((cat, idx) => (
              <tr key={cat._id} className="table-row">
                <td className="table-cell text-gray-500">{idx + 1}</td>
                <td className="table-cell font-medium text-gray-900">{cat.name}</td>
                <td className="table-cell text-center">
                  {productsCount[cat.name] || 0}
                </td>
                <td className="table-cell flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setNewCategory(cat.name);
                      setShowEditModal(true);
                    }}
                    className="btn-warning btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-sm">
            <div className="modal-header">
              <h2 className="text-lg font-bold text-gray-900">Add Category</h2>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="btn-primary"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-sm">
            <div className="modal-header">
              <h2 className="text-lg font-bold text-gray-900">Edit Category</h2>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Enter new name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="modal-footer">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCategory(null);
                  setNewCategory("");
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCategory}
                className="btn-warning"
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
