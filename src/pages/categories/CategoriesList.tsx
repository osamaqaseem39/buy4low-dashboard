import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { categoryRepository } from '../../repositories/categoryRepository';
import { Category } from '../../types';
import toast from 'react-hot-toast';

const CategoriesList = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery('categories', () =>
    categoryRepository.getAll()
  );

  const { mutate: deleteCategory } = useMutation(
    (id: string) => categoryRepository.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        toast.success('Category deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete category');
      },
    }
  );

  const categories: Category[] = data?.data || [];

  const handleDelete = (id: string, name: string) => {
    if (
      window.confirm(`Are you sure you want to delete the category "${name}"?`)
    ) {
      deleteCategory(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link to="/categories/new" className="btn btn-primary">
          Add New Category
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Slug</th>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link
                      to={`/categories/${category._id}`}
                      className="font-semibold hover:text-primary-600"
                    >
                      {category.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-mono text-sm">
                    {category.slug}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {category.description || '-'}
                  </td>
                  <td className="py-3 px-4">
                    {category.isActive ? (
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
                        to={`/categories/${category._id}`}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        View
                      </Link>
                      <Link
                        to={`/categories/${category._id}/edit`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(category._id, category.name)}
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
          {categories.length === 0 && (
            <div className="text-center py-8 text-gray-500">No categories found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesList;

