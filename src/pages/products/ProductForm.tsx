import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { productRepository } from '../../repositories/productRepository';
import { categoryRepository } from '../../repositories/categoryRepository';
import { brandRepository } from '../../repositories/brandRepository';
import { Product } from '../../types';
import toast from 'react-hot-toast';

const ProductForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: productData } = useQuery(
    ['product', id],
    () => productRepository.getById(id!),
    { enabled: isEdit }
  );

  const { data: categoriesData } = useQuery('categories', () =>
    categoryRepository.getAll()
  );

  const { data: brandsData } = useQuery('brands', () => brandRepository.getAll());

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    compareAtPrice: '',
    sku: '',
    category: '',
    subcategory: '',
    brand: '',
    stock: '',
    isActive: true,
    isAffiliate: false,
    affiliateLink: '',
    images: [] as string[],
    tags: [] as string[],
    specifications: {} as Record<string, string>,
  });

  useEffect(() => {
    if (productData?.data) {
      const product: Product = productData.data;
      setFormData({
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription || '',
        price: product.price.toString(),
        compareAtPrice: product.compareAtPrice?.toString() || '',
        sku: product.sku,
        category:
          typeof product.category === 'string' ? product.category : (product.category as any)?._id || '',
        subcategory: product.subcategory || '',
        brand: product.brand || '',
        stock: product.stock.toString(),
        isActive: product.isActive,
        isAffiliate: product.isAffiliate,
        affiliateLink: product.affiliateLink || '',
        images: product.images || [],
        tags: product.tags || [],
        specifications: product.specifications || {},
      });
    }
  }, [productData]);

  const { mutate, isLoading } = useMutation(
    async (data: any) => {
      if (isEdit) {
        return productRepository.update(id!, data);
      } else {
        return productRepository.create(data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success(`Product ${isEdit ? 'updated' : 'created'} successfully`);
        navigate('/products');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Operation failed');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice
        ? parseFloat(formData.compareAtPrice)
        : undefined,
      stock: parseInt(formData.stock),
    };
    mutate(data);
  };

  const categories = categoriesData?.data || [];
  const brands = brandsData?.data || [];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Product Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">SKU *</label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input"
            >
              <option value="">Select a category</option>
              {categories.map((cat: any) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <select
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="input"
            >
              <option value="">Select a brand</option>
              {brands.map((brand: any) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Price *</label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Compare At Price</label>
            <input
              type="number"
              step="0.01"
              value={formData.compareAtPrice}
              onChange={(e) =>
                setFormData({ ...formData, compareAtPrice: e.target.value })
              }
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Stock *</label>
            <input
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subcategory</label>
            <input
              type="text"
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Short Description</label>
          <textarea
            value={formData.shortDescription}
            onChange={(e) =>
              setFormData({ ...formData, shortDescription: e.target.value })
            }
            className="input"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description *</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input"
            rows={6}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URLs (one per line)</label>
          <textarea
            value={formData.images.join('\n')}
            onChange={(e) =>
              setFormData({
                ...formData,
                images: e.target.value.split('\n').filter((url) => url.trim()),
              })
            }
            className="input"
            rows={4}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <span>Active</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isAffiliate}
              onChange={(e) =>
                setFormData({ ...formData, isAffiliate: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span>Affiliate Product</span>
          </label>
        </div>

        {formData.isAffiliate && (
          <div>
            <label className="block text-sm font-medium mb-2">Affiliate Link</label>
            <input
              type="url"
              value={formData.affiliateLink}
              onChange={(e) =>
                setFormData({ ...formData, affiliateLink: e.target.value })
              }
              className="input"
              placeholder="https://amazon.com/dp/..."
            />
          </div>
        )}

        <div className="flex gap-4">
          <button type="submit" disabled={isLoading} className="btn btn-primary">
            {isLoading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

