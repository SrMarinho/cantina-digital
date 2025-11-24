import { apiClient } from "./apiClient";


class OrdersService {
  private basePath = '/orders';

  async getAll() {
    return await apiClient.get(this.basePath)
  }

  async get(id: string) {
    return await apiClient.get(`${this.basePath}/${id}`)
  }

  async post() {
    return await apiClient.post(this.basePath, {})
  }
}

export const ordersService = new OrdersService()