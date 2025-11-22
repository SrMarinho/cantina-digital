import { PrismaClient, OrderStatus } from "../generated/prisma/client";

const prisma = new PrismaClient();

class Order {
  static async getAll() {
    return await prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });
  }

  static async create(user_id: string, total: number, status: OrderStatus, orderItems: Array<{
    product_id: string;
    quantidade: number;
    preco_unitario: number;
  }>) {
    return await prisma.order.create({
      data: {
        user_id,
        total,
        status,
        orderItems: {
          create: orderItems
        }
      },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });
  }

  static async findByPk(id: string) {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });
  }

  static async update(id: string, data: { 
    user_id?: string; 
    total?: number; 
    status?: OrderStatus;
  }) {
    return await prisma.order.update({
      where: { id },
      data,
      include: {
        user: true,
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });
  }

  static async delete(id: string) {
    return await prisma.order.delete({
      where: { id },
    });
  }

  // Métodos específicos para OrderItems
  static async addItemToOrder(order_id: string, product_id: string, quantidade: number, preco_unitario: number) {
    return await prisma.orderItem.create({
      data: {
        order_id,
        product_id,
        quantidade,
        preco_unitario
      },
      include: {
        product: true,
        order: true
      }
    });
  }

  static async getOrderItems(order_id: string) {
    return await prisma.orderItem.findMany({
      where: { order_id },
      include: {
        product: true
      }
    });
  }

  static async removeItemFromOrder(order_item_id: string) {
    return await prisma.orderItem.delete({
      where: { id: order_item_id }
    });
  }
}

export default Order;