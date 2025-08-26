// API Configuration for unified Vercel deployment
import { API_CONFIG } from '../config/api';
const API_BASE_URL = API_CONFIG.BASE_URL;

// Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    createdAt: string;
  };
  token: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 1 | -1;
  featured?: boolean;
  isNew?: boolean;
  isSale?: boolean;
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    image?: string;
  }>;
  subtotal: number;
  tax?: number;
  shipping?: number;
  discount?: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken() {
    this.token = localStorage.getItem('goat-auth-token');
  }

  private saveToken(token: string) {
    this.token = token;
    localStorage.setItem('goat-auth-token', token);
  }

  private removeToken() {
    this.token = null;
    localStorage.removeItem('goat-auth-token');
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication Methods
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      this.saveToken(response.data.token);
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data?.token) {
      this.saveToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.request('/auth/logout', {
        method: 'POST',
      });
      this.removeToken();
      return response;
    } catch (error) {
      // Even if the API call fails, remove the token locally
      this.removeToken();
      throw error;
    }
  }

  async getProfile(): Promise<ApiResponse> {
    return this.request('/auth/profile');
  }

  async updateProfile(data: { name?: string; phone?: string }): Promise<ApiResponse> {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async verifyToken(): Promise<ApiResponse> {
    return this.request('/auth/verify-token', {
      method: 'POST',
    });
  }

  // Product Methods
  async getProducts(filters: ProductFilters = {}): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getProduct(id: string): Promise<ApiResponse> {
    return this.request(`/products/${id}`);
  }

  async getFeaturedProducts(limit = 8): Promise<ApiResponse> {
    return this.request(`/products/featured?limit=${limit}`);
  }

  async getNewArrivals(limit = 8): Promise<ApiResponse> {
    return this.request(`/products/new-arrivals?limit=${limit}`);
  }

  async getSaleProducts(limit = 8): Promise<ApiResponse> {
    return this.request(`/products/sale?limit=${limit}`);
  }

  async getCategories(): Promise<ApiResponse> {
    return this.request('/products/categories');
  }

  async getBrands(): Promise<ApiResponse> {
    return this.request('/products/brands');
  }

  async searchProducts(query: string, page = 1, limit = 12): Promise<ApiResponse> {
    return this.request(`/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }

  // Order Methods
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(page = 1, limit = 10, status?: string): Promise<ApiResponse> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      queryParams.append('status', status);
    }

    return this.request(`/orders?${queryParams.toString()}`);
  }

  async getOrder(id: string): Promise<ApiResponse> {
    return this.request(`/orders/${id}`);
  }

  async trackOrder(orderNumber: string): Promise<ApiResponse> {
    return this.request(`/orders/track/${orderNumber}`);
  }

  async cancelOrder(id: string, reason?: string): Promise<ApiResponse> {
    return this.request(`/orders/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  // Admin Methods (if needed)
  async getAllOrders(filters: Record<string, unknown> = {}): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/orders/all${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getOrderStatistics(startDate?: string, endDate?: string): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);

    const queryString = queryParams.toString();
    const endpoint = `/orders/statistics${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async updateOrderStatus(id: string, status: string, note?: string): Promise<ApiResponse> {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    });
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse> {
    return fetch(`${this.baseURL.replace('/api', '')}/health`)
      .then(res => res.json());
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual methods for convenience
export const {
  login,
  register,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken,
  getProducts,
  getProduct,
  getFeaturedProducts,
  getNewArrivals,
  getSaleProducts,
  getCategories,
  getBrands,
  searchProducts,
  createOrder,
  getOrders,
  getOrder,
  trackOrder,
  cancelOrder,
  getAllOrders,
  getOrderStatistics,
  updateOrderStatus,
  healthCheck,
} = apiClient;