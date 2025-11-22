import { PrismaClient, OrderStatus } from "../generated/prisma/client";

const prisma = new PrismaClient();

class Order {
  static async getAll() {
    return await prisma.order.findMany();
  }

  static async create(user_id: string, total: number, status: OrderStatus) {

//   id          String    @id @default(uuid())
//   user_id     String
//   data_pedido DateTime  @default(now())
//   total       Float     // ou Decimal se usar PostgreSQL
//   status      String
    return await prisma.order.create({
      data: {
        user_id,
        total,
        status
      },
    });
  }
  
  static async findByPk(id: string) {
    return await prisma.order.findUnique({
      where: {
        id
      }
    })
  }

  static async update(id: string, data: { 
    nome?: string; 
    descricao?: string; 
    preco?: number;
    disponivel?: boolean; 
    imagem?: string;
  }) {
    return await prisma.order.update({
      where: { id },
      data
    });
  }

  static async delete(id: string) {
    return await prisma.order.delete({
      where: {
        id,
      },
    });
  }
}

export default Product