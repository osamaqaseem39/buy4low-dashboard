import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { orderRepository } from '../../repositories/orderRepository';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['order', id],
    () => orderRepository.getById(id!),
    { enabled: !!id }
  );

  const { mutate: updateStatus } = useMutation(
    ({ orderStatus, paymentStatus }: { orderStatus?: string; paymentStatus?: string }) =>
      orderRepository.updateStatus(id!, orderStatus, paymentStatus),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders');
        queryClient.invalidateQueries(['order', id]);
        toast.success('Order status updated successfully');
      },
      onError: () => {
        toast.error('Failed to update order status');
      },
    }
  );

  const order = data?.data;

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Order not found</p>
        <Link to="/orders" className="btn btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/orders" className="text-primary-600 hover:underline mb-2 inline-block">
            ← Back to Orders
          </Link>
          <h1 className="text-3xl font-bold">Order #{order._id.slice(-8)}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b pb-4 last:border-0"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between text-xl font-bold pt-4 border-t">
                <span>Total Amount</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          {order.shippingAddress && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="space-y-2">
                <p className="font-semibold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-semibold text-gray-600">Customer:</span>
                <p>{order.user?.name || order.user?.email || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600">Order Date:</span>
                <p>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600">Payment Method:</span>
                <p>
                  {order.paymentMethod.replace('_', ' ').replace(/\b\w/g, (l: string) =>
                    l.toUpperCase()
                  )}
                </p>
              </div>
              {order.transactionId && (
                <div>
                  <span className="text-sm font-semibold text-gray-600">Transaction ID:</span>
                  <p className="font-mono text-sm">{order.transactionId}</p>
                </div>
              )}
              <div className="pt-3 border-t">
                <span className="text-sm font-semibold text-gray-600">Total Amount:</span>
                <p className="text-2xl font-bold text-primary-600">
                  ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Update Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Order Status</label>
                <select
                  value={order.orderStatus}
                  onChange={(e) =>
                    updateStatus({ orderStatus: e.target.value })
                  }
                  className="input"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Payment Status</label>
                <select
                  value={order.paymentStatus}
                  onChange={(e) =>
                    updateStatus({ paymentStatus: e.target.value })
                  }
                  className="input"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Current Status</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-semibold text-gray-600">Order Status:</span>
                <div className="mt-1">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.orderStatus === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.orderStatus === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-600">Payment Status:</span>
                <div className="mt-1">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      order.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : order.paymentStatus === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() +
                      order.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

