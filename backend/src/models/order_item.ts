import { PrismaClient, OrderStatus } from "../generated/prisma/client";

const prisma = new PrismaClient();

class OrderItem {
  static async getAll() {
    return await prisma.orderItem.findMany();
  }

  static async create(order_id: string, product_id: string, quantidade: number, preco_unitario: number) {
    return await prisma.orderItem.create({
      data: {
        order_id,
        product_id,
        quantidade,
        preco_unitario
      },
    });
  }
  
  static async findByPk(id: string) {
    return await prisma.orderItem.findUnique({
      where: {
        id
      }
    })
  }

  static async update(id: string, data: { 
    order_id: string;
    product_id: string;
    quantidade: number;
    preco_unitario: number;
  }) {
    return await prisma.orderItem.update({
      where: { id },
      data
    });
  }

  static async delete(id: string) {
    return await prisma.orderItem.delete({
      where: {
        id,
      },
    });
  }
}

export default OrderItem