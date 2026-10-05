'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  isLoaded: boolean;
  addItem: (product: Product, quantity?: number) => { success: boolean; message: string };
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopsphere_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initialize cart from localStorage on client-side mount only
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync cart items to localStorage on state changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to storage', e);
      }
    }
  }, [items, isLoaded]);

  const addItem = (product: Product, quantity: number = 1): { success: boolean; message: string } => {
    if (product.stock_quantity <= 0) {
      return { success: false, message: 'This item is currently out of stock.' };
    }

    let message = '';
    let success = true;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);

      if (existingIndex > -1) {
        const existingItem = prevItems[existingIndex];
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > product.stock_quantity) {
          success = false;
          message = `Cannot add more. Only ${product.stock_quantity} available in stock.`;
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };
        message = `Updated ${product.name} quantity to ${newQuantity}.`;
        return updated;
      } else {
        if (quantity > product.stock_quantity) {
          success = false;
          message = `Cannot add ${quantity}. Only ${product.stock_quantity} available.`;
          return prevItems;
        }

        message = `Added ${product.name} to your cart.`;
        return [...prevItems, { product, quantity }];
      }
    });

    return { success, message };
  };

  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const clampedQty = Math.min(quantity, item.product.stock_quantity);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (productId: number): number => {
    const found = items.find((item) => item.product.id === productId);
    return found ? found.quantity : 0;
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = items.reduce((sum, item) => {
    const price = parseFloat(item.product.price) || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartTotal,
        isLoaded,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
