import { PrismaClient } from "../generated/prisma/client";
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();

class User {
  static async getAllUsers() {
    return await prisma.user.findMany();
  }

  static async createUser(name: string, email: string, password: string, schoolId?: number) {

    const secretKey = process.env.JWT_SECRET || 'default_secret_key';

    const hashedPassword = await bcrypt.hash(password + secretKey, 10);

    return await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        schoolId
      },
    });
  }
  
  static async findByPk(id: number) {
    return await prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  static async getUserByEmail(email: string, schoolId: number) {
    return await prisma.user.findFirst({
      where: {
        email,
        schoolId
      }
    });
  }

  static async deleteUserByEmail(email: string, schoolId: number) {
    return await prisma.user.deleteMany({
      where: {
        email,
        schoolId
      },
    });
  }
}

export default User
