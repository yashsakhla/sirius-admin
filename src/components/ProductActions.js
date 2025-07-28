// src/components/ProductActions.js

export default function ProductActions({ product, onToggleActive, onDelete, onEdit }) {
  return (
    <div className="flex gap-2">
      {/* Toggle Active/Inactive */}
      <button
        onClick={onToggleActive}
        className={`px-2 py-1 text-xs rounded ${
          product.active ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
        } text-white`}
      >
        {product.active ? 'Active' : 'Inactive'}
      </button>

      {/* Edit button */}
      <button
        onClick={() => onEdit(product)} // 💡 Call onEdit prop from parent
        className="px-2 py-1 text-xs bg-yellow-400 hover:bg-yellow-500 text-white rounded"
      >
        Edit
      </button>

      {/* Delete button */}
      <button
        onClick={onDelete}
        className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
      >
        Delete
      </button>
    </div>
  );
}
