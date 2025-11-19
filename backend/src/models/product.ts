import { PrismaClient } from "@prisma/client";

class Product {
  private static prisma: PrismaClient = new PrismaClient();

  static async getAll() {
    return await this.prisma.user.findMany();
  }

  static async create(name: string, email: string) {
    return await this.prisma.user.create({
      data: {
        name,
        email,
      },
    });
  }
  
  static async findByPk(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  static async delete(id: number) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}

export default Product