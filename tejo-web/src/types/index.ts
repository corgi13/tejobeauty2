export interface User {
  id: string;
  email: string;
  name?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  inStock: boolean;
  stockCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  author?: string;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  total: number;
  paymentMethod?: string;
  shippingAddress?: ShippingAddress;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  order?: Order;
  product?: Product;
}

export interface ShippingAddress {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface UploadResponse {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}