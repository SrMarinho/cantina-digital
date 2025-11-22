import { PrismaClient } from "../generated/prisma/client";
import bcrypt from 'bcrypt';
import { hashPassword, comparePassword } from "../utils/password.utils";


const prisma = new PrismaClient();

class User {
  static async getAllUsers() {
    return await prisma.user.findMany();
  }

  static async createUser(nome: string, email: string, senha: string) {
    return await prisma.user.create({
      data: {
        nome,
        email,
        senha_hash: senha,
      },
    });
  }
  
  static async findByPk(id: string) {
    return await prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  static async getUserByEmail(email: string) {
    return await prisma.user.findFirst({
      where: {
        email,
      }
    });
  }

  static async deleteUserByEmail(email: string) {
    return await prisma.user.deleteMany({
      where: {
        email,
      },
    });
  }
}

export default User
