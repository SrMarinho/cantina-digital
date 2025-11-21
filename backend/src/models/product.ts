import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

class Product {
  static async getAll() {
    return await prisma.product.findMany();
  }

  static async create(name: string, basePrice: number, isAvailable: boolean = true, description?: string, imageUrl?: string) {
    return await prisma.product.create({
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
    return await prisma.product.findUnique({
      where: {
        id
      }
    })
  }

  static async update(id: number, data: Partial<{ name: string; price: number; description: string; isAvailable: boolean; imageUrl: string;}>) {
    return await prisma.product.updateMany({
      where: {
        id,
      },
      data
    });
  }

  static async delete(id: number) {
    return await prisma.product.delete({
      where: {
        id,
      },
    });
  }
}

export default Product