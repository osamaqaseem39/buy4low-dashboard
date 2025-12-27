import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { orderRepository } from '../../repositories/orderRepository';
import { Order } from '../../types';

const OrdersList = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { data, isLoading } = useQuery('orders', () => orderRepository.getAll());

  const orders: Order[] = data?.data || [];

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter(
          (order) =>
            order.orderStatus === filterStatus || order.paymentStatus === filterStatus
        );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input w-auto"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed Payment</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Items</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Payment</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">#{order._id.slice(-8)}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-semibold">
                        {order.user?.name || order.user?.email || 'N/A'}
                      </p>
                      {order.shippingAddress && (
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">{order.items.length} item(s)</td>
                  <td className="py-3 px-4 font-semibold">
                    ${order.totalAmount.toFixed(2)}
                  </td>
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
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : order.paymentStatus === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">No orders found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersList;

