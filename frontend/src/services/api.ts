import { Category, PaginatedProducts, Product, Order, OrderInputPayload, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred with your request.';
    if (data) {
      if (typeof data.detail === 'string') {
        errorMessage = data.detail;
      } else if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        const firstVal = data[firstKey];
        if (Array.isArray(firstVal) && firstVal.length > 0) {
          errorMessage = `${firstKey}: ${firstVal[0]}`;
        } else if (typeof firstVal === 'string') {
          errorMessage = `${firstKey}: ${firstVal}`;
        }
      }
    }
    throw new ApiError(response.status, errorMessage, data);
  }

  return data as T;
}

// 1. Products & Categories API
export const productsApi = {
  getCategories: () => request<Category[]>('/categories/'),

  getProducts: (params?: { search?: string; category?: string; ordering?: string; page?: number; featured?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.ordering) query.set('ordering', params.ordering);
    if (params?.page) query.set('page', params.page.toString());
    if (params?.featured) query.set('featured', 'true');

    const qs = query.toString();
    return request<PaginatedProducts>(`/products/${qs ? `?${qs}` : ''}`);
  },

  getProduct: (id: string | number) => request<Product>(`/products/${id}/`),
};

// 2. Authentication API
export const authApi = {
  register: (payload: { name: string; email: string; password: string; password_confirm: string }) =>
    request<{ token: string; user: User; message: string }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ token: string; user: User; message: string }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: (token: string) =>
    request<{ detail: string }>('/auth/logout/', {
      method: 'POST',
    }, token),

  getMe: (token: string) =>
    request<User>('/auth/me/', { method: 'GET' }, token),

  updateProfile: (payload: Partial<User['profile']> & { name?: string }, token: string) =>
    request<User>('/auth/profile/', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }, token),
};

// 3. Orders API
export const ordersApi = {
  getOrders: (token: string) =>
    request<Order[]>('/orders/', { method: 'GET' }, token),

  getOrder: (identifier: string | number, token: string) =>
    request<Order>(`/orders/${identifier}/`, { method: 'GET' }, token),

  createOrder: (payload: OrderInputPayload, token: string) =>
    request<Order>('/orders/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, token),
};
