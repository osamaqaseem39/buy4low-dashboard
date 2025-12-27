import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { productRepository } from '../../repositories/productRepository';
import { Product } from '../../types';
import toast from 'react-hot-toast';

const Inventory = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockUpdate, setStockUpdate] = useState({ adjustment: 0, reason: '' });

  const { data, isLoading } = useQuery(
    ['products', 'inventory', searchTerm],
    () =>
      productRepository.getAll({
        limit: 1000,
        search: searchTerm || undefined,
      }),
    { keepPreviousData: true }
  );

  const { mutate: updateStock } = useMutation(
    ({ id, stock }: { id: string; stock: number }) =>
      productRepository.updateStock(id, stock),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products', 'inventory']);
        toast.success('Stock updated successfully');
        setEditingProduct(null);
        setStockUpdate({ adjustment: 0, reason: '' });
      },
      onError: () => {
        toast.error('Failed to update stock');
      },
    }
  );

  const products: Product[] = data?.data || [];

  const lowStockProducts = products.filter(
    (p) => p.stock <= lowStockThreshold && p.isActive
  );

  const outOfStockProducts = products.filter((p) => p.stock === 0 && p.isActive);

  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
  );

  const handleStockUpdate = () => {
    if (!editingProduct) return;
    const newStock = editingProduct.stock + stockUpdate.adjustment;
    if (newStock < 0) {
      toast.error('Stock cannot be negative');
      return;
    }
    updateStock({ id: editingProduct._id, stock: newStock });
  };

  const handleQuickAdjust = (product: Product, adjustment: number) => {
    const newStock = product.stock + adjustment;
    if (newStock < 0) {
      toast.error('Stock cannot be negative');
      return;
    }
    updateStock({ id: product._id, stock: newStock });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span>Low Stock Threshold:</span>
            <input
              type="number"
              min="0"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 0)}
              className="input w-20"
            />
          </label>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Products</h3>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Inventory Value</h3>
          <p className="text-3xl font-bold text-green-600">
            ${totalInventoryValue.toFixed(2)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Low Stock Items</h3>
          <p className="text-3xl font-bold text-yellow-600">{lowStockProducts.length}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Out of Stock</h3>
          <p className="text-3xl font-bold text-red-600">{outOfStockProducts.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <input
          type="text"
          placeholder="Search products by name, SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="card mb-6 bg-yellow-50 border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">
            Low Stock Alert ({lowStockProducts.length} items)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {lowStockProducts.slice(0, 6).map((product) => (
              <div
                key={product._id}
                className="flex justify-between items-center p-2 bg-white rounded"
              >
                <Link
                  to={`/products/${product._id}`}
                  className="text-sm hover:text-primary-600 flex-1"
                >
                  {product.name}
                </Link>
                <span className="text-sm font-semibold text-red-600">
                  Stock: {product.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inventory Table */}
      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">SKU</th>
                <th className="text-left py-3 px-4">Current Stock</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Value</th>
                <th className="text-left py-3 px-4">Quick Actions</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className={`border-b hover:bg-gray-50 ${
                    product.stock === 0
                      ? 'bg-red-50'
                      : product.stock <= lowStockThreshold
                      ? 'bg-yellow-50'
                      : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.thumbnail || product.images[0] || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <Link
                          to={`/products/${product._id}`}
                          className="font-semibold hover:text-primary-600"
                        >
                          {product.name}
                        </Link>
                        <div className="text-sm text-gray-500">${product.price.toFixed(2)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-mono text-sm">
                    {product.sku}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold text-lg ${
                        product.stock === 0
                          ? 'text-red-600'
                          : product.stock <= lowStockThreshold
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {product.stock === 0 ? (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                        Out of Stock
                      </span>
                    ) : product.stock <= lowStockThreshold ? (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                        Low Stock
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    ${(product.price * product.stock).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleQuickAdjust(product, -1)}
                        className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                        title="Decrease by 1"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => handleQuickAdjust(product, 1)}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                        title="Increase by 1"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleQuickAdjust(product, 10)}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                        title="Increase by 10"
                      >
                        +10
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setStockUpdate({ adjustment: 0, reason: '' });
                      }}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-8 text-gray-500">No products found</div>
          )}
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Adjust Stock</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setStockUpdate({ adjustment: 0, reason: '' });
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-2">{editingProduct.name}</p>
                <p className="text-gray-600">SKU: {editingProduct.sku}</p>
                <p className="text-gray-600">Current Stock: {editingProduct.stock}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Stock Adjustment (+/-)
                </label>
                <input
                  type="number"
                  value={stockUpdate.adjustment || ''}
                  onChange={(e) =>
                    setStockUpdate({
                      ...stockUpdate,
                      adjustment: parseInt(e.target.value) || 0,
                    })
                  }
                  className="input"
                  placeholder="e.g., -5 or +10"
                />
                <p className="text-sm text-gray-500 mt-1">
                  New stock will be: {editingProduct.stock + stockUpdate.adjustment}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reason (Optional)</label>
                <textarea
                  value={stockUpdate.reason}
                  onChange={(e) =>
                    setStockUpdate({ ...stockUpdate, reason: e.target.value })
                  }
                  className="input"
                  rows={3}
                  placeholder="e.g., Received new shipment, Damaged items returned, etc."
                />
              </div>

              <div className="flex gap-4">
                <button onClick={handleStockUpdate} className="btn btn-primary flex-1">
                  Update Stock
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setStockUpdate({ adjustment: 0, reason: '' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

