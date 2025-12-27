import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Layout = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-primary-50/20">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen shadow-2xl border-r border-gray-700/50">
        <div className="p-6 border-b border-gray-700/50">
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            Buy4Low
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-medium">Admin Dashboard</p>
        </div>
        <nav className="mt-8 px-4">
          <Link
            to="/"
            className="block px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-primary-700/20 transition-all duration-200 mb-2 font-medium hover:scale-105 transform"
          >
            📊 Dashboard
          </Link>
          <div className="px-4 py-2 text-gray-400 text-xs font-bold uppercase tracking-wider mt-6 mb-2">
            Products
          </div>
          <Link
            to="/products"
            className="block px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-primary-700/20 transition-all duration-200 pl-8 font-medium hover:scale-105 transform mb-1"
          >
            All Products
          </Link>
          <Link
            to="/categories"
            className="block px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-accent-600/20 hover:to-accent-700/20 transition-all duration-200 pl-8 font-medium hover:scale-105 transform mb-1"
          >
            Categories
          </Link>
          <Link
            to="/brands"
            className="block px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-secondary-600/20 hover:to-secondary-700/20 transition-all duration-200 pl-8 font-medium hover:scale-105 transform mb-1"
          >
            Brands
          </Link>
          <Link
            to="/inventory"
            className="block px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-600/20 hover:to-accent-600/20 transition-all duration-200 pl-8 font-medium hover:scale-105 transform mb-1"
          >
            Inventory
          </Link>
          <div className="px-4 py-2 text-gray-400 text-xs font-bold uppercase tracking-wider mt-6 mb-2">
            Sales
          </div>
          <Link
            to="/orders"
            className="block px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-secondary-600/20 hover:to-secondary-700/20 transition-all duration-200 font-medium hover:scale-105 transform"
          >
            📦 Orders
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-1">Logged in as</p>
            <p className="font-bold text-white">{user?.name}</p>
            <p className="text-sm text-gray-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="glass border-b border-gray-200/50 h-20 flex items-center px-6 shadow-sm">
          <h2 className="text-2xl font-extrabold gradient-text">Admin Dashboard</h2>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

