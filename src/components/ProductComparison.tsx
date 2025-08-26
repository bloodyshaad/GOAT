import React, { useState } from 'react';
import { X, Star, ShoppingCart, Heart, Scale } from 'lucide-react';
import { Product } from '../data/products';

interface ProductComparisonProps {
  products: Product[];
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onRemoveFromComparison: (productId: string) => void;
}

export function ProductComparison({ 
  products, 
  onClose, 
  onAddToCart, 
  onRemoveFromComparison 
}: ProductComparisonProps) {
  const [selectedAttribute, setSelectedAttribute] = useState<string>('overview');

  const attributes = [
    { id: 'overview', label: 'Overview' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'ratings', label: 'Ratings & Reviews' },
    { id: 'features', label: 'Features' },
    { id: 'availability', label: 'Availability' }
  ];

  const renderAttributeContent = (product: Product, attribute: string) => {
    switch (attribute) {
      case 'overview':
        return (
          <div className="space-y-3">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-gray-600 text-sm">{product.description}</p>
          </div>
        );
      
      case 'pricing':
        return (
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-black">${product.price}</div>
              {product.originalPrice && (
                <div className="text-lg text-gray-500 line-through">
                  ${product.originalPrice}
                </div>
              )}
              {product.isSale && (
                <div className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold mt-2">
                  {Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF
                </div>
              )}
            </div>
          </div>
        );
      
      case 'ratings':
        return (
          <div className="space-y-3 text-center">
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-lg font-semibold">{product.rating}/5</div>
            <div className="text-sm text-gray-600">{product.reviews} reviews</div>
          </div>
        );
      
      case 'features':
        return (
          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Category</h4>
              <span className="inline-block bg-gray-100 px-2 py-1 rounded-full text-xs font-medium capitalize">
                {product.category}
              </span>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Available Sizes</h4>
              <div className="flex flex-wrap gap-1">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className="inline-block bg-gray-100 px-2 py-1 rounded text-xs"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Available Colors</h4>
              <div className="flex gap-2">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'availability':
        return (
          <div className="space-y-3 text-center">
            <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              In Stock
            </div>
            {product.isNew && (
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold ml-2">
                New Arrival
              </div>
            )}
            <div className="text-sm text-gray-600">
              Free shipping on orders over $100
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Scale className="w-6 h-6 text-black" />
              <h2 className="text-2xl font-bold text-black">Product Comparison</h2>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
                {products.length} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Attribute Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {attributes.map((attr) => (
                <button
                  key={attr.id}
                  onClick={() => setSelectedAttribute(attr.id)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                    selectedAttribute === attr.id
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {attr.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Content */}
          <div className="p-6">
            <div className={`grid gap-6 ${
              products.length === 2 ? 'grid-cols-2' : 
              products.length === 3 ? 'grid-cols-3' : 
              'grid-cols-4'
            }`}>
              {products.map((product) => (
                <div key={product.id} className="relative">
                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveFromComparison(product.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Product Content */}
                  <div className="border border-gray-200 rounded-lg p-4 h-full">
                    {renderAttributeContent(product, selectedAttribute)}
                    
                    {/* Action Buttons */}
                    <div className="mt-6 space-y-2">
                      <button
                        onClick={() => onAddToCart(product)}
                        className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2">
                        <Heart className="w-4 h-4" />
                        Add to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {products.length === 0 && (
              <div className="text-center py-12">
                <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No products to compare
                </h3>
                <p className="text-gray-500">
                  Add products to your comparison list to see them here
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Compare up to 4 products side by side
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}