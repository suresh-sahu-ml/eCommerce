export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  volume: number;
  concentration: string;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  deliveryAddress: string;
  phone: string;
}

export interface CreateOrderResponse {
  orderId: string;
  status: string;
  totalAmount: number;
  estimatedDelivery: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}
