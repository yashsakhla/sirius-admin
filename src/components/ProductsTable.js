// src/components/ProductsTable.js
import ProductActions from "./ProductActions.js";
import {
  formatProductPriceDisplay,
  formatProductSizesDisplay,
} from "../constants/productSizes";
import { formatProductCategoryLabel } from "../constants/productCategory";

export default function ProductsTable({ products, onToggleActive, onDelete, onEdit }) {
  return (
    <table className="w-full text-sm bg-white shadow rounded overflow-x-auto">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="px-4 py-2">Product ID</th>
          <th className="px-4 py-2">Image</th>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Description</th>
          <th className="px-4 py-2">Listing</th>
          <th className="px-4 py-2">Size</th>
          <th className="px-4 py-2">Category</th>
          <th className="px-4 py-2">Price</th>
          <th className="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p._id} className="border-t">
            <td className="px-4 py-2">{p._id}</td>
            <td className="px-4 py-2">
              <img
                src={(Array.isArray(p.images) && p.images.length ? p.images[0] : p.image)}
                alt={p.name}
                className="w-16 h-auto object-cover rounded"
              />
            </td>
            <td className="px-4 py-2">{p.name}</td>
            <td className="px-4 py-2">{p.description}</td>
            <td className="px-4 py-2">{formatProductCategoryLabel(p)}</td>
            <td className="px-4 py-2">{formatProductSizesDisplay(p)}</td>
            <td className="px-4 py-2">{p.category}</td>
            <td className="px-4 py-2 whitespace-normal max-w-xs">
              {formatProductPriceDisplay(p)}
            </td>
            <td className="px-4 py-2">
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
  );
}
