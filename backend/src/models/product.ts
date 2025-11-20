import { PrismaClient } from "@prisma/client";

class Product {
  private static prisma: PrismaClient = new PrismaClient();

  static async getAll() {
    return await this.prisma.product.findMany();
  }

  static async create(name: string, price: number, isAvailable: boolean = true, description?: string, imageUrl?: string) {
    return await this.prisma.product.create({
      data: {
        name,
        price,
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

  static async delete(id: number) {
    return await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}

export default Product