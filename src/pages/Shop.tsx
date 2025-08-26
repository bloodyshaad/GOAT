import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { ProductFilter } from '../components/ProductFilter';
import { ProductModal } from '../components/ProductModal';
import { ProductGridSkeleton } from '../components/LoadingSpinner';
import { EnhancedButton } from '../components/EnhancedButton';
import { ParallaxContainer } from '../components/ParallaxContainer';
import { AuthGuard, useAuthGuard } from '../components/AuthGuard';
import { products, type Product } from '../data/products';
import { useAnalytics } from '../services/analytics';

interface AddToCartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
}

interface ShopProps {
  onAddToCart: (product: AddToCartProduct) => void;
}

interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  sizes: string[];
  colors: string[];
  rating: number;
  inStock: boolean;
  onSale: boolean;
  isNew: boolean;
}

export function Shop({ onAddToCart }: ShopProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState<string>('add-to-cart');
  
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 1000 },
    sizes: [],
    colors: [],
    rating: 0,
    inStock: false,
    onSale: false,
    isNew: false
  });

  const analytics = useAnalytics();
  const { checkAuthForPurchase } = useAuthGuard();

  useEffect(() => {
    analytics.trackPageView('/shop');
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [analytics]);

  const handleAddToCart = (product: AddToCartProduct) => {
    if (!checkAuthForPurchase()) {
      setAuthAction('add-to-cart');
      setShowAuthModal(true);
      return;
    }

    onAddToCart(product);
  };

  const handleProductClick = (product: Product) => {
    analytics.trackProductView({
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price
    });

    setSelectedProduct(product);
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 1000 },
      sizes: [],
      colors: [],
      rating: 0,
      inStock: false,
      onSale: false,
      isNew: false
    });
  };

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    // Price filter
    if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
      return false;
    }

    // Rating filter
    if (filters.rating > 0 && product.rating < filters.rating) {
      return false;
    }

    // Feature filters
    if (filters.onSale && !product.isSale) return false;
    if (filters.isNew && !product.isNew) return false;

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });

  const activeFiltersCount = 
    filters.categories.length + 
    filters.brands.length + 
    (filters.rating > 0 ? 1 : 0) + 
    (filters.inStock ? 1 : 0) + 
    (filters.onSale ? 1 : 0) + 
    (filters.isNew ? 1 : 0) +
    (filters.priceRange.min > 0 || filters.priceRange.max < 1000 ? 1 : 0);

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ParallaxContainer speed={0.1} className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
              Shop Collection
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our curated selection of premium streetwear and luxury fashion
            </p>
          </ParallaxContainer>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-colors duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-colors duration-200 ${
                  viewMode === 'list'
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Button */}
            <EnhancedButton
              variant="secondary"
              onClick={() => setIsFilterOpen(true)}
              icon={Filter}
              iconPosition="left"
              className="relative"
            >
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black dark:bg-white text-white dark:text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </EnhancedButton>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            {filters.categories.map(category => (
              <span key={category} className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white text-sm rounded-full">
                {category}
                <button
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    categories: prev.categories.filter(c => c !== category)
                  }))}
                  className="hover:bg-gray-700 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            ))}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <ProductGridSkeleton />
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "space-y-6"
          }>
            {filteredProducts.map((product, index) => (
              <ParallaxContainer
                key={product.id}
                speed={0.02 + (index % 4) * 0.01}
                className={`group cursor-pointer ${
                  viewMode === 'list' ? 'flex gap-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg' : 'transform hover:scale-105'
                } transition-all duration-500`}
                onClick={() => handleProductClick(product)}
              >
                <div className={`relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-700 ${
                  viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-[3/4] mb-4'
                } shadow-lg group-hover:shadow-2xl transition-all duration-500`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-xs font-semibold">
                        NEW
                      </span>
                    )}
                    {product.isSale && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        SALE
                      </span>
                    )}
                  </div>

                  {/* Quick Add Button */}
                  <div className={`absolute ${viewMode === 'list' ? 'bottom-4 right-4' : 'bottom-4 left-4 right-4'} opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500`}>
                    <EnhancedButton
                      variant="gradient"
                      size="sm"
                      fullWidth={viewMode === 'grid'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                          quantity: 1
                        });
                      }}
                    >
                      Quick Add
                    </EnhancedButton>
                  </div>
                </div>

                {/* Product Info */}
                <div className={`${viewMode === 'list' ? 'flex-1' : ''} space-y-2`}>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">★ {product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-400 dark:text-gray-500">({product.reviews} reviews)</span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-gray-200 transition-colors duration-200">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black dark:text-white text-lg">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-gray-500 dark:text-gray-400 line-through text-sm">${product.originalPrice}</span>
                    )}
                  </div>

                  {viewMode === 'list' && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                      Premium quality garment crafted with attention to detail and comfort in mind.
                    </p>
                  )}
                </div>
              </ParallaxContainer>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <SlidersHorizontal className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your filters or search terms
            </p>
            <EnhancedButton variant="secondary" onClick={clearFilters}>
              Clear Filters
            </EnhancedButton>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}

      {/* Filter Sidebar */}
      <ProductFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Authentication Modal */}
      <AuthGuard
        action={authAction}
        showModal={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      >
        <></>
      </AuthGuard>
    </div>
  );
}