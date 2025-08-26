import React, { useState } from 'react';
import { Heart, ShoppingCart, X, Share2, Eye, Star } from 'lucide-react';
import { Product } from '../data/products';

interface WishlistProps {
  items: Product[];
  onRemoveItem: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Wishlist({ 
  items, 
  onRemoveItem, 
  onAddToCart, 
  onViewProduct, 
  isOpen, 
  onClose 
}: WishlistProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My GOAT Wishlist',
          text: `Check out my wishlist with ${items.length} amazing products!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-500 fill-current" />
              <div>
                <h2 className="text-xl font-semibold text-black">My Wishlist</h2>
                <p className="text-sm text-gray-600">{items.length} items saved</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                title="Share wishlist"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          {items.length > 0 && (
            <div className="px-6 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-white text-black shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-white text-black shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    List
                  </button>
                </div>
                <button
                  onClick={() => items.forEach(item => onAddToCart(item))}
                  className="text-sm text-black hover:underline font-medium"
                >
                  Add All to Cart
                </button>
              </div>
            </div>
          )}

          {/* Wishlist Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Save items you love to view them later
                </p>
                <button
                  onClick={onClose}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 gap-6' 
                  : 'space-y-4'
              }>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative ${
                      viewMode === 'grid' 
                        ? 'bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300' 
                        : 'flex gap-4 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300'
                    }`}
                  >
                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {viewMode === 'grid' ? (
                      <>
                        {/* Grid View */}
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {item.isSale && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              SALE
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(item.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">
                              ({item.reviews})
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-bold text-black">${item.price}</span>
                            {item.originalPrice && (
                              <span className="text-gray-500 line-through text-sm">
                                ${item.originalPrice}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onAddToCart(item)}
                              className="flex-1 bg-black text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-1"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </button>
                            <button
                              onClick={() => onViewProduct(item)}
                              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* List View */}
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 pr-4">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {item.name}
                              </h3>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < Math.floor(item.rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                                <span className="text-xs text-gray-500 ml-1">
                                  ({item.reviews})
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="font-bold text-black">${item.price}</span>
                                {item.originalPrice && (
                                  <span className="text-gray-500 line-through text-sm">
                                    ${item.originalPrice}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => onAddToCart(item)}
                                className="bg-black text-white py-1 px-3 rounded text-sm font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center gap-1"
                              >
                                <ShoppingCart className="w-3 h-3" />
                                Add to Cart
                              </button>
                              <button
                                onClick={() => onViewProduct(item)}
                                className="border border-gray-300 py-1 px-3 rounded text-sm hover:bg-gray-50 transition-colors duration-200 flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {items.length} item{items.length !== 1 ? 's' : ''} in your wishlist
                </div>
                <button
                  onClick={() => items.forEach(item => onAddToCart(item))}
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add All to Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}