import { PrismaClient } from "@prisma/client";
import { OrderStatus } from '../generated/prisma/client';
import Order from "../models/order";

const prisma = new PrismaClient();

class OrderService {
  static async createOrderWithValidation(
    user_id: string, 
    items: Array<{
      product_id: string;
      quantidade: number;
    }>
  ) {
    // Validar usuário
    const user = await prisma.user.findUnique({
      where: { id: user_id }
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Validar produtos e calcular total
    let total = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.product_id }
      });

      if (!product) {
        throw new Error(`Produto ${item.product_id} não encontrado`);
      }

      if (!product.disponivel) {
        throw new Error(`Produto ${product.nome} não está disponível`);
      }

      if (item.quantidade <= 0) {
        throw new Error(`Quantidade inválida para produto ${product.nome}`);
      }

      const itemTotal = product.preco * item.quantidade;
      total += itemTotal;

      orderItemsData.push({
        product_id: product.id,
        quantidade: item.quantidade,
        preco_unitario: product.preco
      });
    }

    // Criar pedido
    const order = await Order.create(
      user_id,
      total,
      OrderStatus.PENDING,
      orderItemsData
    );

    return order;
  }

  static async getOrderWithDetails(order_id: string) {
    return await Order.findByPk(order_id);
  }

  static async getUserOrders(user_id: string) {
    return await prisma.order.findMany({
      where: { user_id },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        data_pedido: 'desc'
      }
    });
  }
}

export { OrderService };