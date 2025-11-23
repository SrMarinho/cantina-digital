import { apiClient } from "./apiClient";


class ProductsService {
  private basePath = '/products';

  async getAll() {
    return await apiClient.get(this.basePath)
  }

  async get(id: string) {
    return await apiClient.get(`${this.basePath}/${id}`)
  }
}

export const productsService = new ProductsService()