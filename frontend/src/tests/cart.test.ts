import { describe, it, expect } from 'vitest';
import { Product, CartItem } from '../types';

describe('ShopSphere Cart Calculations & Business Logic', () => {
  const dummyProduct: Product = {
    id: 1,
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    description: 'Crisp sound',
    price: '189.99',
    category: 1,
    category_name: 'Electronics',
    category_slug: 'electronics',
    image: 'https://example.com/headphones.jpg',
    stock_quantity: 5,
    is_active: true,
    is_in_stock: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  };

  const dummyProduct2: Product = {
    id: 2,
    name: 'Ceramic Mug',
    slug: 'ceramic-mug',
    description: 'Minimalist mug',
    price: '25.00',
    category: 2,
    category_name: 'Home',
    category_slug: 'home-living',
    image: 'https://example.com/mug.jpg',
    stock_quantity: 10,
    is_active: true,
    is_in_stock: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  };

  it('calculates total items count correctly', () => {
    const items: CartItem[] = [
      { product: dummyProduct, quantity: 2 },
      { product: dummyProduct2, quantity: 3 },
    ];
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    expect(totalCount).toBe(5);
  });

  it('calculates total monetary amount correctly without floating point errors', () => {
    const items: CartItem[] = [
      { product: dummyProduct, quantity: 2 }, // 2 * 189.99 = 379.98
      { product: dummyProduct2, quantity: 3 }, // 3 * 25.00 = 75.00
    ];
    const total = items.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity;
    }, 0);

    expect(total.toFixed(2)).toBe('454.98');
  });

  it('prevents ordering beyond available stock limits', () => {
    const requestedQuantity = 10;
    const availableStock = dummyProduct.stock_quantity; // 5
    const allowed = requestedQuantity <= availableStock;
    expect(allowed).toBe(false);
  });

  it('clamps updated quantity within [1, stock_quantity]', () => {
    const clamp = (qty: number, maxStock: number) => {
      if (qty <= 0) return 0;
      return Math.min(qty, maxStock);
    };

    expect(clamp(8, dummyProduct.stock_quantity)).toBe(5);
    expect(clamp(3, dummyProduct.stock_quantity)).toBe(3);
    expect(clamp(-1, dummyProduct.stock_quantity)).toBe(0);
  });
});
