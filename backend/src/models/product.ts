import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

class Product {
  static async getAll() {
    return await prisma.product.findMany();
  }

  static async create(nome: string, descricao: string, preco: number, disponivel: boolean = true, imagem?: string) {
    return await prisma.product.create({
      data: {
        nome,
        preco,
        disponivel,
        descricao,
        imagem,
      },
    });
  }
  
  static async findByPk(id: string) {
    return await prisma.product.findUnique({
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
    return await prisma.product.update({
      where: { id },
      data
    });
  }

  static async delete(id: string) {
    return await prisma.product.delete({
      where: {
        id,
      },
    });
  }
}

export default Product