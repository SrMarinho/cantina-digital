import { apiClient } from "./apiClient";
import type { Order } from "../types/order.types";


class OrdersService {
  private basePath = '/orders';

  async getAll() {
    return await apiClient.get(this.basePath)
  }

  async get(id: string) {
    return await apiClient.get(`${this.basePath}/${id}`)
  }

  async post(order: Order) {
    return await apiClient.post(this.basePath, order)
  }
}

export const ordersService = new OrdersService()