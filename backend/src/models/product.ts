import { PrismaClient } from "../generated/prisma/client";

class Product {
  private static prisma: PrismaClient = new PrismaClient();

  static async getAll() {
    return await this.prisma.product.findMany();
  }

  static async create(name: string, basePrice: number, isAvailable: boolean = true, description?: string, imageUrl?: string) {
    return await this.prisma.product.create({
      data: {
        name,
        basePrice,
        isAvailable,
        description,
        imageUrl,
      },
    });
  }
  
  static async findByPk(id: number) {
    return await this.prisma.product.findUnique({
      where: {
        id
      }
    })
  }

  static async update(id: number, data: Partial<{ name: string; price: number; description: string; isAvailable: boolean; imageUrl: string;}>) {
    return await this.prisma.product.updateMany({
      where: {
        id,
      },
      data
    });
  }

  static async delete(id: number) {
    return await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}

export default Product