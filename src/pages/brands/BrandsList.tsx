import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { brandRepository } from '../../repositories/brandRepository';
import { Brand } from '../../types';
import toast from 'react-hot-toast';

const BrandsList = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery('brands', () => brandRepository.getAll());

  const { mutate: deleteBrand } = useMutation(
    (id: string) => brandRepository.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('brands');
        toast.success('Brand deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete brand');
      },
    }
  );

  const brands: Brand[] = data?.data || [];

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the brand "${name}"?`)) {
      deleteBrand(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Brands</h1>
        <Link to="/brands/new" className="btn btn-primary">
          Add New Brand
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Logo</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Slug</th>
                <th className="text-left py-3 px-4">Website</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No Logo
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/brands/${brand._id}`}
                      className="font-semibold hover:text-primary-600"
                    >
                      {brand.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-mono text-sm">
                    {brand.slug}
                  </td>
                  <td className="py-3 px-4">
                    {brand.website ? (
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        Visit
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {brand.isActive ? (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                        Active
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/brands/${brand._id}`}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        View
                      </Link>
                      <Link
                        to={`/brands/${brand._id}/edit`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(brand._id, brand.name)}
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
          {brands.length === 0 && (
            <div className="text-center py-8 text-gray-500">No brands found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrandsList;

