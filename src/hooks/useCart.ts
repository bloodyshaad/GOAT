import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface AddToCartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  selectedSize?: string;
  selectedColor?: string;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: AddToCartProduct) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => 
        item.id === product.id && 
        item.selectedSize === product.selectedSize && 
        item.selectedColor === product.selectedColor
      );

      if (existingItem) {
        return prev.map(item =>
          item.id === product.id && 
          item.selectedSize === product.selectedSize && 
          item.selectedColor === product.selectedColor
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }

      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: product.quantity || 1,
        selectedSize: product.selectedSize,
        selectedColor: product.selectedColor,
      }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    clearCart,
  };
}