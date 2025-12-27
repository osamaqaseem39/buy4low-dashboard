import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { productRepository } from '../../repositories/productRepository';
import { Product } from '../../types';
import toast from 'react-hot-toast';

const ProductsList = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery(
    ['products', page, searchTerm],
    () => productRepository.getAll({ page, limit: 20, search: searchTerm || undefined }),
    { keepPreviousData: true }
  );

  const { mutate: deleteProduct } = useMutation(
    (id: string) => productRepository.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('Product deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete product');
      },
    }
  );

  const { mutate: toggleActive } = useMutation(
    ({ id, isActive }: { id: string; isActive: boolean }) =>
      productRepository.toggleActive(id, isActive),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('Product status updated');
      },
      onError: () => {
        toast.error('Failed to update product status');
      },
    }
  );

  const products: Product[] = data?.data || [];
  const totalPages = data?.pages || 1;

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    toggleActive({ id, isActive: !currentStatus });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link to="/products/new" className="btn btn-primary">
          Add New Product
        </Link>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <input
          type="text"
          placeholder="Search products by name, SKU, or description..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="input"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Image</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">SKU</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link to={`/products/${product._id}`}>
                        <img
                          src={product.thumbnail || product.images[0] || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/products/${product._id}`}
                        className="font-semibold hover:text-primary-600"
                      >
                        {product.name}
                      </Link>
                      {product.shortDescription && (
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {product.shortDescription}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{product.sku}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold">${product.price.toFixed(2)}</div>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <div className="text-sm text-gray-500 line-through">
                          ${product.compareAtPrice.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          product.stock > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {product.isAffiliate ? (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                          Affiliate
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          Direct
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(product._id, product.isActive)}
                        className={`px-2 py-1 rounded text-sm ${
                          product.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          View
                        </Link>
                        <Link
                          to={`/products/${product._id}/edit`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && (
              <div className="text-center py-8 text-gray-500">No products found</div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="btn btn-outline disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`btn ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="btn btn-outline disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductsList;

