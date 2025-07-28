import { useEffect, useState } from "react";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
    loadDataIfNeeded("products");
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
      await updateProduct(updatedProduct._id, updatedProduct);
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

  if (loading.products && !products) return <p>Loading products...</p>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
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
