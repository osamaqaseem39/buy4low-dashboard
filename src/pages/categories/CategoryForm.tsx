import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { categoryRepository } from '../../repositories/categoryRepository';
import { Category } from '../../types';
import toast from 'react-hot-toast';

const CategoryForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: categoryData } = useQuery(
    ['category', id],
    () => categoryRepository.getById(id!),
    { enabled: isEdit }
  );

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true,
  });

  useEffect(() => {
    if (categoryData?.data) {
      const category: Category = categoryData.data;
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image: category.image || '',
        isActive: category.isActive,
      });
    }
  }, [categoryData]);

  const { mutate, isLoading } = useMutation(
    async (data: any) => {
      if (isEdit) {
        return categoryRepository.update(id!, data);
      } else {
        return categoryRepository.create(data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        toast.success(`Category ${isEdit ? 'updated' : 'created'} successfully`);
        navigate('/categories');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Operation failed');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        {isEdit ? 'Edit Category' : 'Add New Category'}
      </h1>

      <form onSubmit={handleSubmit} className="card space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
                slug: generateSlug(e.target.value),
              })
            }
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Slug *</label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="input"
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          />
          <p className="text-sm text-gray-500 mt-1">
            URL-friendly identifier (e.g., "electronics", "home-garden")
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="input"
            placeholder="https://example.com/image.jpg"
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Category preview"
              className="mt-2 w-32 h-32 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4"
          />
          <label>Active</label>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={isLoading} className="btn btn-primary">
            {isLoading ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/categories')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;

