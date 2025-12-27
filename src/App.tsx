import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductsList from './pages/products/ProductsList';
import ProductForm from './pages/products/ProductForm';
import ProductDetail from './pages/products/ProductDetail';
import CategoriesList from './pages/categories/CategoriesList';
import CategoryForm from './pages/categories/CategoryForm';
import CategoryDetail from './pages/categories/CategoryDetail';
import BrandsList from './pages/brands/BrandsList';
import BrandForm from './pages/brands/BrandForm';
import BrandDetail from './pages/brands/BrandDetail';
import OrdersList from './pages/orders/OrdersList';
import OrderDetail from './pages/orders/OrderDetail';
import Inventory from './pages/inventory/Inventory';

function App() {
  const { user, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user || user.role !== 'admin') {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={user && user.role === 'admin' ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="categories" element={<CategoriesList />} />
        <Route path="categories/new" element={<CategoryForm />} />
        <Route path="categories/:id/edit" element={<CategoryForm />} />
        <Route path="categories/:id" element={<CategoryDetail />} />
        <Route path="brands" element={<BrandsList />} />
        <Route path="brands/new" element={<BrandForm />} />
        <Route path="brands/:id/edit" element={<BrandForm />} />
        <Route path="brands/:id" element={<BrandDetail />} />
        <Route path="orders" element={<OrdersList />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="inventory" element={<Inventory />} />
      </Route>
    </Routes>
  );
}

export default App;

