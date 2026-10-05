export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  product_count?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  category: number;
  category_name: string;
  category_slug: string;
  image: string;
  stock_quantity: number;
  is_active: boolean;
  is_in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedProducts {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserProfile {
  address: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  date_joined: string;
  profile?: UserProfile;
}

export interface OrderItem {
  id: number;
  product: number | null;
  product_name: string;
  product_image: string | null;
  unit_price: string;
  quantity: number;
  subtotal: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total_amount: string;
  full_name: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  items: OrderItem[];
  item_count: number;
  created_at: string;
  updated_at: string;
}

export interface OrderInputPayload {
  full_name: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}
