import React from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuthGuard } from './AuthGuard';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  total: number;
  onProceedToCheckout?: () => void;
}

export function Cart({ items, onClose, onRemoveItem, onUpdateQuantity, total, onProceedToCheckout }: CartProps) {
  const { checkAuthForPurchase } = useAuthGuard();
  const shipping = total > 100 ? 0 : 15;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  const handleProceedToCheckout = () => {
    // Check authentication before allowing checkout
    if (!checkAuthForPurchase()) {
      return;
    }
    
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-black dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              Shopping Cart ({items.length})
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">Your cart is empty</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Add some products to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-black dark:text-white truncate">{item.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedColor && item.selectedSize && <span>•</span>}
                        {item.selectedColor && (
                          <div className="flex items-center gap-1">
                            <span>Color:</span>
                            <div
                              className="w-3 h-3 rounded-full border border-gray-200 dark:border-gray-600"
                              style={{ backgroundColor: item.selectedColor }}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-black dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold border-t border-gray-200 dark:border-gray-700 pt-2 text-black dark:text-white">
                  <span>Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Add ${(100 - total).toFixed(2)} more for free shipping
                </div>
              )}
              
              <button 
                onClick={handleProceedToCheckout}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-full font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={onClose}
                className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}