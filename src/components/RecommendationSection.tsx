import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart, TrendingUp } from 'lucide-react';
import { recommendationEngine, RecommendationContext, Recommendation } from '../services/recommendations';
import { analytics } from '../services/analytics';
import { Product } from '../data/products';

interface RecommendationSectionProps {
  context: RecommendationContext;
  userId?: string;
  limit?: number;
  onAddToCart: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onProductClick?: (product: Product) => void;
  className?: string;
}

export function RecommendationSection({
  context,
  userId,
  limit = 8,
  onAddToCart,
  onAddToWishlist,
  onProductClick,
  className = ''
}: RecommendationSectionProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [title, setTitle] = useState('Recommended for You');
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);

  const loadRecommendations = useCallback(async () => {
    setIsLoading(true);
    try {
      const recommendationSet = recommendationEngine.getRecommendations(context, userId, limit);
      setRecommendations(recommendationSet.recommendations);
      setTitle(recommendationSet.title);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      // Reduce analytics logging - only log critical errors
      if (process.env.NODE_ENV === 'development') {
        analytics.trackError('recommendation_load_failed', JSON.stringify(context));
      }
    } finally {
      setIsLoading(false);
    }
  }, [context, userId, limit]);

  const updateVisibleCount = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1280) setVisibleCount(4);
    else if (width >= 1024) setVisibleCount(3);
    else if (width >= 768) setVisibleCount(2);
    else setVisibleCount(1);
  }, []);

  useEffect(() => {
    loadRecommendations();
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [loadRecommendations, updateVisibleCount]);

  const handleProductClick = (recommendation: Recommendation) => {
    // Reduce analytics logging - only track important interactions
    if (Math.random() < 0.1) { // Only log 10% of clicks to reduce noise
      analytics.track('recommendation_clicked', {
        category: 'recommendations',
        action: 'click',
        label: recommendation.product.name,
        value: recommendation.score,
        productId: recommendation.product.id,
        algorithm: recommendation.algorithm,
        reason: recommendation.reason,
        contextType: context.type
      });
    }

    onProductClick?.(recommendation.product);
  };

  const handleAddToCart = (recommendation: Recommendation) => {
    onAddToCart(recommendation.product);
    
    // Track recommendation conversion - this is important
    analytics.track('recommendation_converted', {
      category: 'recommendations',
      action: 'add_to_cart',
      label: recommendation.product.name,
      value: recommendation.product.price,
      productId: recommendation.product.id,
      algorithm: recommendation.algorithm,
      contextType: context.type
    });
  };

  const handleAddToWishlist = (recommendation: Recommendation) => {
    onAddToWishlist?.(recommendation.product);
    
    // Track wishlist - less frequent logging
    if (Math.random() < 0.5) { // Only log 50% of wishlist actions
      analytics.track('recommendation_wishlisted', {
        category: 'recommendations',
        action: 'add_to_wishlist',
        label: recommendation.product.name,
        productId: recommendation.product.id,
        algorithm: recommendation.algorithm,
        contextType: context.type
      });
    }
  };

  const nextSlide = () => {
    setCurrentIndex(prev => 
      Math.min(prev + visibleCount, recommendations.length - visibleCount)
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - visibleCount, 0));
  };

  const getAlgorithmIcon = (algorithm: string) => {
    switch (algorithm) {
      case 'trending':
        return <TrendingUp className="w-3 h-3 text-orange-500" />;
      case 'collaborative_filtering':
        return <Star className="w-3 h-3 text-blue-500" />;
      case 'popularity':
        return <Heart className="w-3 h-3 text-red-500" />;
      default:
        return <Star className="w-3 h-3 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <section className={`py-12 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: visibleCount }).map((_, index) => (
                <div key={`skeleton-${index}`} className="space-y-4">
                  <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
              {title}
            </h2>
            <p className="text-gray-600">
              Curated just for you using advanced AI recommendations
            </p>
          </div>
          
          {recommendations.length > visibleCount && (
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex >= recommendations.length - visibleCount}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Recommendations Grid */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              width: `${(recommendations.length / visibleCount) * 100}%`
            }}
          >
            {recommendations.map((recommendation, index) => (
              <div
                key={`rec-${recommendation.product.id}-${recommendation.algorithm}-${index}`}
                className="flex-shrink-0 px-3"
                style={{ width: `${100 / recommendations.length}%` }}
              >
                <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  {/* Product Image */}
                  <div 
                    className="relative aspect-square bg-gray-100 cursor-pointer overflow-hidden"
                    onClick={() => handleProductClick(recommendation)}
                  >
                    <img
                      src={recommendation.product.image}
                      alt={recommendation.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    
                    {/* Algorithm Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      {getAlgorithmIcon(recommendation.algorithm)}
                      <span className="text-xs font-medium text-gray-700">
                        {Math.round(recommendation.score)}
                      </span>
                    </div>

                    {/* Product Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1">
                      {recommendation.product.isNew && (
                        <span className="bg-black text-white px-2 py-1 rounded-full text-xs font-semibold">
                          NEW
                        </span>
                      )}
                      {recommendation.product.isSale && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          SALE
                        </span>
                      )}
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(recommendation);
                          }}
                          className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center gap-1"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                        {onAddToWishlist && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToWishlist(recommendation);
                            }}
                            className="bg-white text-black px-3 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={`star-${index}-${i}`}
                          className={`w-3 h-3 ${
                            i < Math.floor(recommendation.product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({recommendation.product.reviews})
                      </span>
                    </div>

                    <h3 
                      className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-black transition-colors duration-200"
                      onClick={() => handleProductClick(recommendation)}
                    >
                      {recommendation.product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-black text-lg">
                        ${recommendation.product.price}
                      </span>
                      {recommendation.product.originalPrice && (
                        <span className="text-gray-500 line-through text-sm">
                          ${recommendation.product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Recommendation Reason */}
                    <div className="text-xs text-gray-500 bg-gray-50 rounded-full px-2 py-1 inline-block">
                      {recommendation.reason}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        {recommendations.length > visibleCount && (
          <div className="text-center mt-8">
            <button className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-300">
              View All Recommendations
            </button>
          </div>
        )}
      </div>
    </section>
  );
}