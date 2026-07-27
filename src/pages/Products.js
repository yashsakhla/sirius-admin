import { useEffect, useState, useRef } from "react";
import ProductsTable from "../components/ProductsTable";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import { useGlobalData } from "../context/GlobalDataContext";
import { createProduct, updateProduct, deleteProduct, setAuthToken } from "../api";

export default function Products() {
  const { data, loading, loadDataIfNeeded, refreshData } = useGlobalData();
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const products = data.products;
  const loadDataRef = useRef(loadDataIfNeeded);
  loadDataRef.current = loadDataIfNeeded;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    loadDataRef.current("products");
  }, []);

  const handleToggleActive = async (id) => {
    try {
      const target = products.find((p) => p._id === id);
      if (!target) return;

      await updateProduct(id, { active: !target.active });
      await refreshData("products");
    } catch (err) {
      console.error("Error toggling active status:", err);
      alert("Failed to toggle active status.");
    }
  };

  const handleAddProduct = async (product) => {
    try {
      await createProduct(product);
      await refreshData("products");
      setShowModal(false);
    } catch (error) {
      console.error("Failed to create product:", error.message);
      alert(error?.response?.data?.message || "Failed to add product.");
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const { _id, ...body } = updatedProduct;
      await updateProduct(_id, body);
      await refreshData("products");
      setEditProduct(null);
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      await refreshData("products");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product.");
    }
  };

  if (loading.products && !products) return <p className="p-6 text-gray-500">Loading products...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage your catalog, pricing, and sizes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Add Product
        </button>
      </div>

      {/* Products Table */}
      <ProductsTable
        products={products || []}
        onToggleActive={handleToggleActive}
        onDelete={handleDeleteProduct}
        onEdit={(product) => setEditProduct(product)}
      />

      {/* Add Product Modal */}
      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddProduct}
        />
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={handleUpdateProduct}
        />
      )}
    </div>
  );
}
