// src/components/ProductActions.js

export default function ProductActions({ product, onToggleActive, onDelete, onEdit }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {/* Toggle Active/Inactive */}
      <button
        onClick={onToggleActive}
        className={product.active ? 'btn-success btn-sm' : 'btn-danger btn-sm'}
      >
        {product.active ? 'Active' : 'Inactive'}
      </button>

      {/* Edit button */}
      <button
        onClick={() => onEdit(product)} // 💡 Call onEdit prop from parent
        className="btn-warning btn-sm"
      >
        Edit
      </button>

      {/* Delete button */}
      <button
        onClick={onDelete}
        className="btn-danger btn-sm"
      >
        Delete
      </button>
    </div>
  );
}
