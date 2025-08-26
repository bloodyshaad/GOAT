import React, { useState } from 'react';
import { User as UserIcon, Package, Heart, Settings, CreditCard, MapPin, Bell } from 'lucide-react';
import type { User } from '../types';

interface AccountProps {
  user: User | null;
  onLogout: () => void;
}

export function Account({ user, onLogout }: AccountProps) {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'wishlist', name: 'Wishlist', icon: Heart },
    { id: 'addresses', name: 'Addresses', icon: MapPin },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 299.99,
      items: 2
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'Shipped',
      total: 189.99,
      items: 1
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'Processing',
      total: 459.99,
      items: 3
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Please Sign In</h2>
          <p className="text-gray-600 dark:text-gray-400">You need to be logged in to access your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">My Account</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900 p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <UserIcon className="w-10 h-10 text-gray-600 dark:text-gray-400" />
                </div>
                <h3 className="font-semibold text-black dark:text-white">{user.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{user.email}</p>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-black dark:bg-white text-white dark:text-black'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.name}
                  </button>
                ))}
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900 p-8 border border-gray-200 dark:border-gray-700">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Profile Information</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Doe"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Order History</h2>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-black dark:text-white">Order {order.id}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Placed on {order.date}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'Delivered' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                            order.status === 'Shipped' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                            'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-gray-600 dark:text-gray-400">{order.items} items</p>
                          <p className="font-semibold text-black dark:text-white">${order.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-6">My Wishlist</h2>
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">Your wishlist is empty</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Save items you love for later</p>
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Saved Addresses</h2>
                  <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300 mb-6">
                    Add New Address
                  </button>
                  <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">No saved addresses</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Add an address for faster checkout</p>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div>
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Payment Methods</h2>
                  <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300 mb-6">
                    Add Payment Method
                  </button>
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 mb-2">No payment methods saved</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Add a payment method for faster checkout</p>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    {[
                      { title: 'Order Updates', description: 'Get notified about your order status' },
                      { title: 'New Arrivals', description: 'Be the first to know about new products' },
                      { title: 'Sales & Promotions', description: 'Receive exclusive offers and discounts' },
                      { title: 'Newsletter', description: 'Weekly fashion tips and trends' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <h3 className="font-medium text-black dark:text-white">{item.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 dark:peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black dark:peer-checked:bg-white"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-black dark:text-white mb-4">Change Password</h3>
                      <form className="space-y-4">
                        <input
                          type="password"
                          placeholder="Current Password"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <button
                          type="submit"
                          className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300"
                        >
                          Update Password
                        </button>
                      </form>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                      <h3 className="font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
                      <button className="bg-red-600 dark:bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-300">
                        Delete Account
                      </button>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                        This action cannot be undone. All your data will be permanently deleted.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}