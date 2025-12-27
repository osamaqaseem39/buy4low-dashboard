import { useQuery } from 'react-query';
import api from '../api/axios';

const Dashboard = () => {
  const { data: ordersData } = useQuery('orders', async () => {
    const response = await api.get('/orders');
    return response.data;
  });

  const { data: productsData } = useQuery('products', async () => {
    const response = await api.get('/products?limit=1000');
    return response.data;
  });

  const orders = ordersData?.data || [];
  const products = productsData?.data || [];

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o: any) => o.orderStatus === 'pending').length,
    totalRevenue: orders
      .filter((o: any) => o.paymentStatus === 'paid')
      .reduce((sum: number, o: any) => sum + o.totalAmount, 0),
    totalProducts: products.length,
    activeProducts: products.filter((p: any) => p.isActive).length,
    affiliateProducts: products.filter((p: any) => p.isAffiliate).length,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">
            ${stats.totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Total Products</h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.activeProducts} active, {stats.affiliateProducts} affiliate
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((order: any) => (
                <tr key={order._id} className="border-b">
                  <td className="py-3 px-4">#{order._id.slice(-8)}</td>
                  <td className="py-3 px-4">
                    {order.user?.name || order.user?.email || 'N/A'}
                  </td>
                  <td className="py-3 px-4">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        order.orderStatus === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.orderStatus === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center py-8 text-gray-500">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

