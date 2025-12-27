import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { brandRepository } from '../../repositories/brandRepository';
import { Brand } from '../../types';
import toast from 'react-hot-toast';

const BrandForm = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: brandData } = useQuery(
    ['brand', id],
    () => brandRepository.getById(id!),
    { enabled: isEdit }
  );

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    logo: '',
    website: '',
    isActive: true,
  });

  useEffect(() => {
    if (brandData?.data) {
      const brand: Brand = brandData.data;
      setFormData({
        name: brand.name,
        slug: brand.slug,
        description: brand.description || '',
        logo: brand.logo || '',
        website: brand.website || '',
        isActive: brand.isActive,
      });
    }
  }, [brandData]);

  const { mutate, isLoading } = useMutation(
    async (data: any) => {
      if (isEdit) {
        return brandRepository.update(id!, data);
      } else {
        return brandRepository.create(data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('brands');
        toast.success(`Brand ${isEdit ? 'updated' : 'created'} successfully`);
        navigate('/brands');
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
        {isEdit ? 'Edit Brand' : 'Add New Brand'}
      </h1>

      <form onSubmit={handleSubmit} className="card space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Logo URL</label>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="input"
              placeholder="https://example.com/logo.png"
            />
            {formData.logo && (
              <img
                src={formData.logo}
                alt="Logo preview"
                className="mt-2 w-24 h-24 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Website URL</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="input"
              placeholder="https://example.com"
            />
          </div>
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
            {isLoading ? 'Saving...' : isEdit ? 'Update Brand' : 'Create Brand'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/brands')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandForm;

