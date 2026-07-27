// src/components/ProductsTable.js
import ProductActions from "./ProductActions.js";
import {
  formatProductPriceDisplay,
  formatProductSizesDisplay,
  formatProductQtyDisplay,
} from "../constants/productSizes";
import { formatProductCategoryLabel } from "../constants/productCategory";

export default function ProductsTable({ products, onToggleActive, onDelete, onEdit }) {
  return (
    <div className="table-shell">
    <table className="w-full text-sm">
      <thead className="table-head-row">
        <tr>
          <th className="table-cell">Product ID</th>
          <th className="table-cell">Image</th>
          <th className="table-cell">Name</th>
          <th className="table-cell">Description</th>
          <th className="table-cell">Listing</th>
          <th className="table-cell">Size</th>
          <th className="table-cell">Category</th>
          <th className="table-cell">Price</th>
          <th className="table-cell">Qty</th>
          <th className="table-cell">Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p._id} className="table-row">
            <td className="table-cell text-gray-500">{p._id}</td>
            <td className="table-cell">
              <img
                src={(Array.isArray(p.images) && p.images.length ? p.images[0] : p.image)}
                alt={p.name}
                className="w-16 h-16 object-cover rounded-lg border border-gray-100"
              />
            </td>
            <td className="table-cell font-medium text-gray-900">{p.name}</td>
            <td className="table-cell text-gray-600 max-w-xs">
              <span className="line-clamp-2">{p.description}</span>
            </td>
            <td className="table-cell">{formatProductCategoryLabel(p)}</td>
            <td className="table-cell">{formatProductSizesDisplay(p)}</td>
            <td className="table-cell">{p.category}</td>
            <td className="table-cell whitespace-normal max-w-xs">
              {formatProductPriceDisplay(p)}
            </td>
            <td className="table-cell whitespace-normal max-w-xs">
              {formatProductQtyDisplay(p)}
            </td>
            <td className="table-cell">
              <ProductActions
                product={p}
                onToggleActive={() => onToggleActive(p._id)}
                onDelete={() => onDelete(p._id)}
                onEdit={() => onEdit(p)} // 👈 Passed down from Page
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
