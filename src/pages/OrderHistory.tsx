import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, Search, Eye } from 'lucide-react';
import { EnhancedButton } from '../components/EnhancedButton';
import { AnimatedSection } from '../components/AnimatedSection';
import { useAuth } from '../hooks/useAuth';
import { useAnalytics } from '../services/analytics';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  shipping: number;
  tax: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statussetStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.trackPageView('/orders');
    loadOrders();
  }, [analytics]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, statusFilter]);

  const loadOrders = async () => {
    setIsLoading(true);
    
    // Simulate API call - replace with actual API call
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'GOAT-2024-001',
          date: '2024-01-15',
          status: 'delivered',
          items: [
            {
              id: '1',
              name: 'Premium Streetwear Hoodie',
              price: 89.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300',
              size: 'L',
              color: 'Black'
            },
            {
              id: '2',
              name: 'Classic Denim Jacket',
              price: 129.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300',
              size: 'M',
              color: 'Blue'
            }
          ],
          total: 234.97,
          shipping: 0,
          tax: 14.99,
          trackingNumber: 'TRK123456789',
          estimatedDelivery: '2024-01-18',
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          }
        },
        {
          id: '2',
          orderNumber: 'GOAT-2024-002',
          date: '2024-01-20',
          status: 'shipped',
          items: [
            {
              id: '3',
              name: 'Minimalist Sneakers',
              price: 159.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300',
              size: '10',
              color: 'White'
            }
          ],
          total: 174.98,
          shipping: 0,
          tax: 14.99,
          trackingNumber: 'TRK987654321',
          estimatedDelivery: '2024-01-25',
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          }
        },
        {
          id: '3',
          orderNumber: 'GOAT-2024-003',
          date: '2024-01-22',
          status: 'processing',
          items: [
            {
              id: '4',
              name: 'Luxury Watch Collection',
              price: 299.99,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
              color: 'Silver'
            }
          ],
          total: 329.98,
          shipping: 15,
          tax: 14.99,
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          }
        }
      ];

      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  };

  const filterOrders = () => {
    let filtered = orders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <Clock className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign In Required</h2>
          <p className="text-gray-600 dark:text-gray-400">Please sign in to view your order history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeInUp">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">Order History</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Track and manage your GOAT orders
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search orders or products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No orders found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'You haven\'t placed any orders yet'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <AnimatedSection
                key={order.id}
                animation="fadeInUp"
                delay={index * 100}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        Order {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-2 sm:mt-0">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <EnhancedButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        icon={Eye}
                        iconPosition="left"
                      >
                        View Details
                      </EnhancedButton>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Qty: {item.quantity} • ${item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-2 sm:mb-0">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Total: <span className="font-semibold text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
                      </span>
                      {order.trackingNumber && (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Tracking: <span className="font-mono text-gray-900 dark:text-white">{order.trackingNumber}</span>
                        </span>
                      )}
                    </div>
                    {order.estimatedDelivery && (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => setSelectedOrder(null)}></div>
            
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Order Details
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Order Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Order Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Order Number:</span>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.orderNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Date:</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(selectedOrder.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusIcon(selectedOrder.status)}
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </span>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Tracking:</span>
                          <p className="font-mono text-gray-900 dark:text-white">{selectedOrder.trackingNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Items</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              {item.size && <span>Size: {item.size}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                              <span>Qty: {item.quantity}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">${item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Shipping Address</h3>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.shippingAddress.name}</p>
                      <p className="text-gray-600 dark:text-gray-400">{selectedOrder.shippingAddress.street}</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                        <span className="text-gray-900 dark:text-white">${(selectedOrder.total - selectedOrder.shipping - selectedOrder.tax).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                        <span className="text-gray-900 dark:text-white">
                          {selectedOrder.shipping === 0 ? 'Free' : `$${selectedOrder.shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                        <span className="text-gray-900 dark:text-white">${selectedOrder.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg border-t border-gray-200 dark:border-gray-600 pt-2">
                        <span className="text-gray-900 dark:text-white">Total:</span>
                        <span className="text-gray-900 dark:text-white">${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}