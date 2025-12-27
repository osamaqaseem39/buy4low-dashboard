import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { categoryRepository } from '../../repositories/categoryRepository';
import toast from 'react-hot-toast';

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['category', id],
    () => categoryRepository.getById(id!),
    { enabled: !!id }
  );

  const { mutate: deleteCategory } = useMutation(
    () => categoryRepository.delete(id!),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        toast.success('Category deleted successfully');
        navigate('/categories');
      },
      onError: () => {
        toast.error('Failed to delete category');
      },
    }
  );

  const category = data?.data;

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Category not found</p>
        <Link to="/categories" className="btn btn-primary">
          Back to Categories
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (
      window.confirm(`Are you sure you want to delete the category "${category.name}"?`)
    ) {
      deleteCategory();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            to="/categories"
            className="text-primary-600 hover:underline mb-2 inline-block"
          >
            ← Back to Categories
          </Link>
          <h1 className="text-3xl font-bold">{category.name}</h1>
        </div>
        <div className="flex gap-2">
          <Link to={`/categories/${id}/edit`} className="btn btn-primary">
            Edit Category
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Category Information</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-semibold text-gray-600">Slug:</span>
                <p className="font-mono">{category.slug}</p>
              </div>
              {category.description && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Description:</span>
                  <p className="mt-1 whitespace-pre-wrap">{category.description}</p>
                </div>
              )}
              <div>
                <span className="text-sm font-semibold text-gray-600">Status:</span>
                <div className="mt-1">
                  {category.isActive ? (
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
            <h2 className="text-xl font-bold mb-4">Category Image</h2>
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>

          <div className="card mt-6">
            <h2 className="text-xl font-bold mb-4">Metadata</h2>
            <div className="space-y-2 text-sm">
              {category.createdAt && (
                <div>
                  <span className="font-semibold text-gray-600">Created:</span>
                  <p>{new Date(category.createdAt).toLocaleString()}</p>
                </div>
              )}
              {category.updatedAt && (
                <div>
                  <span className="font-semibold text-gray-600">Last Updated:</span>
                  <p>{new Date(category.updatedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;

