import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { productRepository } from '../../repositories/productRepository';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['product', id],
    () => productRepository.getById(id!),
    { enabled: !!id }
  );

  const { mutate: deleteProduct } = useMutation(
    () => productRepository.delete(id!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('Product deleted successfully');
        navigate('/products');
      },
      onError: () => {
        toast.error('Failed to delete product');
      },
    }
  );

  const product = data?.data;

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Product not found</p>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/products" className="text-primary-600 hover:underline mb-2 inline-block">
            ← Back to Products
          </Link>
          <h1 className="text-3xl font-bold">{product.name}</h1>
        </div>
        <div className="flex gap-2">
          <Link to={`/products/${id}/edit`} className="btn btn-primary">
            Edit Product
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Product Images</h2>
            {product.images && product.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No images available</p>
            )}
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>
            {product.shortDescription && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold mb-2">Short Description</h3>
                <p className="text-gray-700">{product.shortDescription}</p>
              </div>
            )}
          </div>

          {/* Specifications */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Specifications</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b pb-2">
                      <dt className="font-semibold text-gray-700">{key}</dt>
                      <dd className="text-gray-600">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Product Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-semibold text-gray-600">SKU:</span>
                <p className="font-mono">{product.sku}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600">Price:</span>
                <p className="text-2xl font-bold text-primary-600">
                  ${product.price.toFixed(2)}
                </p>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <p className="text-gray-500 line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </p>
                )}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600">Stock:</span>
                <p
                  className={`text-lg font-semibold ${
                    product.stock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {product.stock} units
                </p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600">Category:</span>
                <p>
                  {typeof product.category === 'object'
                    ? product.category.name
                    : 'N/A'}
                </p>
              </div>
              {product.brand && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Brand:</span>
                  <p>{typeof product.brand === 'object' ? product.brand.name : 'N/A'}</p>
                </div>
              )}
              {product.subcategory && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Subcategory:</span>
                  <p>{product.subcategory}</p>
                </div>
              )}
              <div>
                <span className="text-sm font-semibold text-gray-600">Status:</span>
                <div className="mt-1">
                  {product.isActive ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                      Inactive
                    </span>
                  )}
                  {product.isAffiliate && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm ml-2">
                      Affiliate
                    </span>
                  )}
                </div>
              </div>
              {product.isAffiliate && product.affiliateLink && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Affiliate Link:</span>
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline break-all"
                  >
                    {product.affiliateLink}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Dimensions & Weight */}
          {(product.dimensions || product.shippingWeight) && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <div className="space-y-2">
                {product.dimensions && (
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Dimensions:</span>
                    <p>
                      {product.dimensions.length} × {product.dimensions.width} ×{' '}
                      {product.dimensions.height} {product.dimensions.unit}
                    </p>
                  </div>
                )}
                {product.shippingWeight && (
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Weight:</span>
                    <p>{product.shippingWeight} lbs</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Metadata</h2>
            <div className="space-y-2 text-sm">
              {product.createdAt && (
                <div>
                  <span className="font-semibold text-gray-600">Created:</span>
                  <p>{new Date(product.createdAt).toLocaleString()}</p>
                </div>
              )}
              {product.updatedAt && (
                <div>
                  <span className="font-semibold text-gray-600">Last Updated:</span>
                  <p>{new Date(product.updatedAt).toLocaleString()}</p>
                </div>
              )}
              {product.rating && (
                <div>
                  <span className="font-semibold text-gray-600">Rating:</span>
                  <p>
                    {product.rating.toFixed(1)} / 5.0 ({product.reviewCount || 0} reviews)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

