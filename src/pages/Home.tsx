import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { Newsletter } from '../components/Newsletter';
import { ProductModal } from '../components/ProductModal';
import { ProductGridSkeleton } from '../components/LoadingSpinner';
import { RecommendationSection } from '../components/RecommendationSection';
import { ParallaxContainer } from '../components/ParallaxContainer';
import { EnhancedButton } from '../components/EnhancedButton';
import { AuthGuard, useAuthGuard } from '../components/AuthGuard';
import { products, type Product } from '../data/products';
import { useAnalytics } from '../services/analytics';
import { recommendationEngine } from '../services/recommendations';
import { useABTest } from '../services/abTesting';

interface AddToCartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
}

interface HomeProps {
  onAddToCart: (product: AddToCartProduct) => void;
  onAddToWishlist?: (product: Product) => void;
}

export function Home({ onAddToCart, onAddToWishlist }: HomeProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState<string>('add-to-cart');
  
  const analytics = useAnalytics();
  const { checkAuthForPurchase, checkAuthForWishlist } = useAuthGuard();
  
  // Remove unused A/B test variables to fix linting errors
  useABTest('hero_cta_test');
  useABTest('product_grid_layout');

  useEffect(() => {
    // Track page view
    analytics.trackPageView('/');
    
    // Track user behavior
    recommendationEngine.trackUserBehavior('view', { page: 'homepage' });

    // Simulate loading products
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [analytics]);

  const handleProductClick = (product: Product) => {
    // Track product view
    analytics.trackProductView({
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price
    });

    // Track for recommendations
    recommendationEngine.trackUserBehavior('view', {
      productId: product.id,
      category: product.category,
      price: product.price
    });

    setSelectedProduct(product);
  };

  const handleAddToCart = (product: AddToCartProduct) => {
    // Check authentication before allowing add to cart
    if (!checkAuthForPurchase()) {
      setAuthAction('add-to-cart');
      setShowAuthModal(true);
      return;
    }

    onAddToCart(product);
    
    // Track add to cart
    analytics.trackAddToCart({
      productId: product.id,
      productName: product.name,
      category: 'unknown', // You might want to pass category through
      price: product.price,
      quantity: product.quantity
    });

    // Track for recommendations
    recommendationEngine.trackUserBehavior('cart', { productId: product.id });
  };

  const handleAddToWishlist = (product: Product) => {
    // Check authentication before allowing add to wishlist
    if (!checkAuthForWishlist()) {
      setAuthAction('add-to-wishlist');
      setShowAuthModal(true);
      return;
    }

    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    
    // Track category selection
    analytics.track('category_selected', {
      category: 'navigation',
      action: 'category_filter',
      label: category
    });
  };

  // Use the handleCategoryChange function to avoid unused variable warning
  const handleCategoryClick = (category: string) => {
    handleCategoryChange(category);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    return matchesCategory;
  });

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <Hero />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header with Parallax */}
        <ParallaxContainer speed={0.1} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
            Premium Collections
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our carefully curated selection of luxury streetwear and premium fashion pieces
          </p>
        </ParallaxContainer>

        {/* Category Filter with Enhanced Buttons */}
        <ParallaxContainer speed={0.05} className="flex flex-wrap justify-center gap-4 mb-12">
          {['all', 'men', 'women', 'accessories', 'new'].map((category) => (
            <EnhancedButton
              key={category}
              onClick={() => handleCategoryClick(category)}
              variant={activeCategory === category ? 'primary' : 'ghost'}
              size="md"
            >
              {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
            </EnhancedButton>
          ))}
        </ParallaxContainer>

        {/* Products Grid or Loading Skeleton */}
        {isLoading ? (
          <ProductGridSkeleton />
        ) : (
          <ParallaxContainer speed={0.05} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in-up">
            {filteredProducts.map((product, index) => (
              <ParallaxContainer
                key={product.id}
                speed={0.02 + (index % 4) * 0.01}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-500 hover:z-10 relative"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 aspect-[3/4] mb-4 shadow-lg group-hover:shadow-2xl dark:shadow-gray-900 transition-all duration-500">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Overlay Effect */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-all duration-300"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        NEW
                      </span>
                    )}
                    {product.isSale && (
                      <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-black px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        SALE
                      </span>
                    )}
                  </div>
                  
                  {/* Enhanced Quick Add Button with Auth Guard */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <EnhancedButton
                      variant="gradient"
                      size="sm"
                      fullWidth
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
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                
                {/* Product Info */}
                <div className="space-y-2 group-hover:transform group-hover:translate-y-1 transition-all duration-300">
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
                </div>
              </ParallaxContainer>
            ))}
          </ParallaxContainer>
        )}
      </section>

      {/* AI-Powered Recommendations */}
      <RecommendationSection
        context={{ type: 'homepage' }}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
        onProductClick={handleProductClick}
        className="bg-white dark:bg-gray-900"
      />

      <Newsletter />
      
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}

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