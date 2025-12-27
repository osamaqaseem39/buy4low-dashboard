import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { brandRepository } from '../../repositories/brandRepository';
import toast from 'react-hot-toast';

const BrandDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['brand', id],
    () => brandRepository.getById(id!),
    { enabled: !!id }
  );

  const { mutate: deleteBrand } = useMutation(
    () => brandRepository.delete(id!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('brands');
        toast.success('Brand deleted successfully');
        navigate('/brands');
      },
      onError: () => {
        toast.error('Failed to delete brand');
      },
    }
  );

  const brand = data?.data;

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!brand) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Brand not found</p>
        <Link to="/brands" className="btn btn-primary">
          Back to Brands
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the brand "${brand.name}"?`)) {
      deleteBrand();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/brands" className="text-primary-600 hover:underline mb-2 inline-block">
            ← Back to Brands
          </Link>
          <h1 className="text-3xl font-bold">{brand.name}</h1>
        </div>
        <div className="flex gap-2">
          <Link to={`/brands/${id}/edit`} className="btn btn-primary">
            Edit Brand
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Brand Information</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-semibold text-gray-600">Slug:</span>
                <p className="font-mono">{brand.slug}</p>
              </div>
              {brand.description && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Description:</span>
                  <p className="mt-1 whitespace-pre-wrap">{brand.description}</p>
                </div>
              )}
              {brand.website && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Website:</span>
                  <p className="mt-1">
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      {brand.website}
                    </a>
                  </p>
                </div>
              )}
              <div>
                <span className="text-sm font-semibold text-gray-600">Status:</span>
                <div className="mt-1">
                  {brand.isActive ? (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Brand Logo</h2>
            {brand.logo ? (
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-full h-64 object-contain rounded-lg bg-gray-50 p-4"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                No logo
              </div>
            )}
          </div>

          <div className="card mt-6">
            <h2 className="text-xl font-bold mb-4">Metadata</h2>
            <div className="space-y-2 text-sm">
              {brand.createdAt && (
                <div>
                  <span className="font-semibold text-gray-600">Created:</span>
                  <p>{new Date(brand.createdAt).toLocaleString()}</p>
                </div>
              )}
              {brand.updatedAt && (
                <div>
                  <span className="font-semibold text-gray-600">Last Updated:</span>
                  <p>{new Date(brand.updatedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDetail;

