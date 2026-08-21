import React from 'react';

export default function ProductList({ products, loading, onEdit, onDelete }) {
  if (loading) {
    return <div className="text-center py-12">Loading products...</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-container rounded-lg">
        <p className="text-on-surface-variant">No products found. Add your first product!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-surface-container">
            <th className="px-6 py-4 text-left font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">
              Product (Name / SKU)
            </th>
            <th className="px-6 py-4 text-left font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">
              Brand
            </th>
            <th className="px-6 py-4 text-left font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">
              Volume
            </th>
            <th className="px-6 py-4 text-left font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">
              Price
            </th>
            <th className="px-6 py-4 text-left font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">
              Stock
            </th>
            <th className="px-6 py-4 text-left font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">
              Status
            </th>
            <th className="px-6 py-4 text-left font-label-sm text-xs uppercase tracking-widest text-on-surface-variant">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-label-sm text-on-surface">{product.productName}</p>
                    <p className="text-xs text-on-surface-variant">{product.sku}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 font-body-md text-on-surface">
                {product.brand || '-'}
              </td>
              <td className="px-6 py-4 font-body-md text-on-surface">
                {product.volumeMl ? `${product.volumeMl}ml` : '-'}
              </td>
              <td className="px-6 py-4 font-label-sm text-on-surface">
                ₹{product.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 font-label-sm text-on-surface">
                {product.stockQuantity}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-label-sm uppercase tracking-wider ${
                    product.active
                      ? 'bg-success-container text-on-success-container'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {product.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="px-4 py-2 bg-primary text-on-primary text-xs font-label-sm uppercase tracking-wider hover:bg-secondary transition-colors rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.productId)}
                    className="px-4 py-2 bg-error text-on-error text-xs font-label-sm uppercase tracking-wider hover:bg-error-container transition-colors rounded"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
