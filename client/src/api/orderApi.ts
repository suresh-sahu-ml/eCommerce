import { axiosInstance } from "./axiosInstance";
import { CreateOrderRequest, CreateOrderResponse } from "../types";

const orderApi = {
  async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    const response = await axiosInstance.post<CreateOrderResponse>(
      "/orders",
      orderData
    );
    return response.data;
  },

  async fetchOrderById(orderId: string) {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
  },

  async fetchUserOrders() {
    const response = await axiosInstance.get("/orders");
    return response.data;
  },

  async cancelOrder(orderId: string) {
    const response = await axiosInstance.post(`/orders/${orderId}/cancel`);
    return response.data;
  },
};

export default orderApi;
