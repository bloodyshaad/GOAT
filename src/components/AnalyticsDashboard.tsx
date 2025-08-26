import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Eye, 
  Heart,
  Search,
  Target,
  DollarSign,
  Filter,
  Download
} from 'lucide-react';
import { TimeRangeSelect, ModernSelect } from './ModernSelect';
import { useAnalytics } from '../services/analytics';
import { abTesting } from '../services/abTesting';

interface AnalyticsMetric {
  label: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<React.ComponentProps<'svg'>>;
  color: string;
}

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d');
  const [isLoading, setIsLoading] = useState(true);
  const analyticsHook = useAnalytics();

  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([
    {
      label: 'Total Users',
      value: '2,847',
      change: 12.5,
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Page Views',
      value: '18,392',
      change: 8.2,
      icon: Eye,
      color: 'green'
    },
    {
      label: 'Conversions',
      value: '342',
      change: -2.1,
      icon: ShoppingCart,
      color: 'purple'
    },
    {
      label: 'Revenue',
      value: '$24,891',
      change: 15.3,
      icon: DollarSign,
      color: 'yellow'
    }
  ]);

  const [chartData] = useState<ChartData[]>([
    { label: 'Mon', value: 120 },
    { label: 'Tue', value: 190 },
    { label: 'Wed', value: 300 },
    { label: 'Thu', value: 500 },
    { label: 'Fri', value: 200 },
    { label: 'Sat', value: 300 },
    { label: 'Sun', value: 450 }
  ]);

  const loadAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate loading analytics data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would fetch from your analytics service
      const events = analyticsHook.getEvents();
      
      // Update metrics based on real data
      updateMetricsFromEvents(events);
      
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [analyticsHook]);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange, loadAnalyticsData]);

  const updateMetricsFromEvents = (events: Array<{ event: string; properties?: Record<string, unknown>; value?: number; timestamp: number; userId?: string }>) => {
    const pageViews = events.filter(e => e.event === 'page_view').length;
    const purchases = events.filter(e => e.event === 'purchase').length;
    const searches = events.filter(e => e.event === 'search').length;
    const wishlistAdds = events.filter(e => e.event === 'wishlist_add').length;

    setMetrics([
      {
        label: 'Page Views',
        value: pageViews.toLocaleString(),
        change: 8.2,
        icon: Eye,
        color: 'blue'
      },
      {
        label: 'Searches',
        value: searches.toLocaleString(),
        change: 12.5,
        icon: Search,
        color: 'green'
      },
      {
        label: 'Purchases',
        value: purchases.toLocaleString(),
        change: purchases > 0 ? 15.3 : -2.1,
        icon: ShoppingCart,
        color: 'purple'
      },
      {
        label: 'Wishlist Adds',
        value: wishlistAdds.toLocaleString(),
        change: 5.7,
        icon: Heart,
        color: 'red'
      }
    ]);
  };

  const exportData = () => {
    const events = analyticsHook.getEvents();
    const dataStr = JSON.stringify(events, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `goat-analytics-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getMetricColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      red: 'text-red-600 bg-red-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your GOAT store performance and user behavior</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Time Range Selector */}
          <TimeRangeSelect
            value={timeRange}
            onChange={(value) => setTimeRange(value as typeof timeRange)}
            className="min-w-[160px]"
          />
          
          {/* Export Button */}
          <button
            onClick={exportData}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getMetricColor(metric.color)}`}>
                <metric.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                metric.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-4 h-4 ${metric.change < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(metric.change)}%
              </div>
            </div>
            <h3 className="text-2xl font-bold text-black mb-1">{metric.value}</h3>
            <p className="text-gray-600 text-sm">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-black">Traffic Overview</h2>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <ModernSelect
                options={[
                  { value: 'pageviews', label: 'Page Views' },
                  { value: 'visitors', label: 'Unique Visitors' },
                  { value: 'conversions', label: 'Conversions' }
                ]}
                value="pageviews"
                onChange={() => {}}
                size="sm"
                className="min-w-[140px]"
              />
            </div>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 text-sm text-gray-600">{item.label}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 relative">
                  <div
                    className="bg-black rounded-full h-3 transition-all duration-500"
                    style={{ width: `${(item.value / Math.max(...chartData.map(d => d.value))) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-sm font-medium text-right">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Top Products</h3>
            <div className="space-y-3">
              {[
                { name: 'Premium Streetwear Hoodie', views: 1247, sales: 89 },
                { name: 'Luxury Sneakers Collection', views: 892, sales: 67 },
                { name: 'Designer Accessories Set', views: 743, sales: 45 }
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-sm text-black">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.views} views</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-black">{product.sales}</p>
                    <p className="text-xs text-gray-500">sales</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* A/B Test Results */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Active A/B Tests</h3>
            <div className="space-y-3">
              {abTesting.getAllExperiments().filter(exp => exp.status === 'running').map((experiment, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm text-black">{experiment.name}</p>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Running
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{experiment.description}</p>
                  <div className="flex items-center gap-2">
                    <Target className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {experiment.targetAudience.percentage}% traffic
                    </span>
                  </div>
                </div>
              ))}
              
              {abTesting.getAllExperiments().filter(exp => exp.status === 'running').length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No active experiments</p>
              )}
            </div>
          </div>

          {/* Real-time Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Real-time Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-600">User viewed Premium Hoodie</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-600">New user signed up</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-600">Purchase completed: $299</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-black mb-6">Recent Events</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Event</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody>
              {analyticsHook.getEvents().slice(-10).reverse().map((event, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                      {event.event}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {event.userId || 'Anonymous'}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {(event.properties as Record<string, unknown>)?.productName as string || '-'}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {event.value ? `$${event.value}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}