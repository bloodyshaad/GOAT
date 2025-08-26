import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { EnhancedButton } from '../components/EnhancedButton';
import { useAnalytics } from '../services/analytics';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
  productGrowth: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  status: 'active' | 'inactive';
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  status: 'active' | 'inactive';
  image: string;
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'customers' | 'products'>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0,
    productGrowth: 0
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const analytics = useAnalytics();

  useEffect(() => {
    analytics.trackPageView('/admin');
    loadDashboardData();
  }, [analytics]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    // Simulate API calls - replace with actual API calls
    setTimeout(() => {
      // Mock stats
      setStats({
        totalRevenue: 125430.50,
        totalOrders: 1247,
        totalCustomers: 892,
        totalProducts: 156,
        revenueGrowth: 12.5,
        orderGrowth: 8.3,
        customerGrowth: 15.2,
        productGrowth: 5.7
      });

      // Mock orders
      setOrders([
        {
          id: '1',
          orderNumber: 'GOAT-2024-001',
          customer: 'John Doe',
          email: 'john@example.com',
          total: 299.99,
          status: 'delivered',
          date: '2024-01-15',
          items: 2
        },
        {
          id: '2',
          orderNumber: 'GOAT-2024-002',
          customer: 'Jane Smith',
          email: 'jane@example.com',
          total: 159.99,
          status: 'shipped',
          date: '2024-01-20',
          items: 1
        },
        {
          id: '3',
          orderNumber: 'GOAT-2024-003',
          customer: 'Mike Johnson',
          email: 'mike@example.com',
          total: 89.99,
          status: 'processing',
          date: '2024-01-22',
          items: 1
        }
      ]);

      // Mock customers
      setCustomers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          orders: 5,
          totalSpent: 1299.95,
          lastOrder: '2024-01-15',
          status: 'active'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          orders: 3,
          totalSpent: 459.97,
          lastOrder: '2024-01-20',
          status: 'active'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          orders: 1,
          totalSpent: 89.99,
          lastOrder: '2024-01-22',
          status: 'active'
        }
      ]);

      // Mock products
      setProducts([
        {
          id: '1',
          name: 'Premium Streetwear Hoodie',
          category: 'Hoodies',
          price: 89.99,
          stock: 25,
          sold: 45,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100'
        },
        {
          id: '2',
          name: 'Classic Denim Jacket',
          category: 'Jackets',
          price: 129.99,
          stock: 15,
          sold: 32,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=100'
        },
        {
          id: '3',
          name: 'Minimalist Sneakers',
          category: 'Shoes',
          price: 159.99,
          stock: 8,
          sold: 67,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100'
        }
      ]);

      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'pending':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'cancelled':
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const StatCard = ({ title, value, growth, icon: Icon, color }: {
    title: string;
    value: string;
    growth: number;
    icon: React.ElementType;
    color: string;
  }) => (
    <AnimatedSection animation="fadeInUp" className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <div className="flex items-center mt-2">
            <TrendingUp className={`w-4 h-4 mr-1 ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth >= 0 ? '+' : ''}{growth}%
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </AnimatedSection>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your GOAT e-commerce platform</p>
            </div>
            <div className="flex items-center gap-4">
              <EnhancedButton variant="secondary" icon={Download} iconPosition="left">
                Export Data
              </EnhancedButton>
              <EnhancedButton variant="primary" icon={Plus} iconPosition="left">
                Add Product
              </EnhancedButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-8 mb-8 border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'products', label: 'Products', icon: Package }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-black dark:border-white text-black dark:text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value={`$${stats.totalRevenue.toLocaleString()}`}
                growth={stats.revenueGrowth}
                icon={DollarSign}
                color="bg-green-500"
              />
              <StatCard
                title="Total Orders"
                value={stats.totalOrders.toLocaleString()}
                growth={stats.orderGrowth}
                icon={ShoppingCart}
                color="bg-blue-500"
              />
              <StatCard
                title="Total Customers"
                value={stats.totalCustomers.toLocaleString()}
                growth={stats.customerGrowth}
                icon={Users}
                color="bg-purple-500"
              />
              <StatCard
                title="Total Products"
                value={stats.totalProducts.toLocaleString()}
                growth={stats.productGrowth}
                icon={Package}
                color="bg-orange-500"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <AnimatedSection animation="fadeInLeft" className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">${order.total}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* Top Products */}
              <AnimatedSection animation="fadeInRight" className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Products</h3>
                <div className="space-y-4">
                  {products.slice(0, 5).map(product => (
                    <div key={product.id} className="flex items-center gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{product.sold} sold</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">${product.price}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{product.stock} in stock</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </div>
              <EnhancedButton variant="secondary" icon={Filter} iconPosition="left">
                Filter
              </EnhancedButton>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {order.orderNumber}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {order.items} items
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {order.customer}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {order.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          ${order.total}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Similar tables for Customers and Products tabs would go here */}
        {activeTab === 'customers' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Customer Management</h3>
            <p className="text-gray-600 dark:text-gray-400">Customer management interface coming soon...</p>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Management</h3>
            <p className="text-gray-600 dark:text-gray-400">Product management interface coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}