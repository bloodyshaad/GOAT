import React, { useState } from 'react';
import { X, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useAuthGuard } from './AuthGuard';
import { useToast } from '../contexts/ToastContext';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description?: string;
  sizes?: string[];
  colors?: string[];
}

interface AddToCartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: AddToCartProduct) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { checkAuthForPurchase, checkAuthForWishlist } = useAuthGuard();
  const { showError } = useToast();

  const handleAddToCart = () => {
    // Check authentication before allowing add to cart
    if (!checkAuthForPurchase()) {
      return;
    }

    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity
    });
    onClose();
  };

  const handleAddToWishlist = () => {
    // Check authentication before allowing add to wishlist
    if (!checkAuthForWishlist()) {
      return;
    }

    // Add to wishlist logic would go here
    showError('Feature Coming Soon', 'Wishlist functionality will be available soon!');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="relative bg-gray-100 dark:bg-gray-700 aspect-square lg:aspect-auto">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={handleAddToWishlist}
                className="absolute top-4 left-4 w-10 h-10 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
              >
                <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300 hover:text-red-500" />
              </button>
            </div>
            
            {/* Product Details */}
            <div className="p-8 overflow-y-auto bg-white dark:bg-gray-800">
              <div className="space-y-6">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-black dark:fill-white text-black dark:text-white'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{product.rating}</span>
                  <span className="text-sm text-gray-400 dark:text-gray-500">({product.reviews} reviews)</span>
                </div>
                
                {/* Product Name */}
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-black dark:text-white mb-2">
                    {product.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {product.description || 'Premium quality garment crafted with attention to detail and comfort in mind.'}
                  </p>
                </div>
                
                {/* Price */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-black dark:text-white">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 dark:text-gray-400 line-through">${product.originalPrice}</span>
                  )}
                </div>
                
                {/* Size Selection */}
                {product.sizes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Size
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`py-3 px-4 border rounded-lg font-medium transition-all duration-200 ${
                            selectedSize === size
                              ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Color Selection */}
                {product.colors && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Color
                    </label>
                    <div className="flex gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                            selectedColor === color
                              ? 'border-black dark:border-white scale-110'
                              : 'border-gray-200 dark:border-gray-600'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg w-32 bg-white dark:bg-gray-700">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-700 dark:text-gray-300"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center py-2 font-medium text-gray-900 dark:text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 text-gray-700 dark:text-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300"
                >
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </button>
                
                {/* Features */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Truck className="w-5 h-5" />
                    <span>Free shipping on orders over $100</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <RotateCcw className="w-5 h-5" />
                    <span>30-day free returns</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="w-5 h-5" />
                    <span>2-year warranty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}