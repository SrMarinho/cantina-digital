import { PrismaClient } from "@prisma/client";

class User {
  private static prisma: PrismaClient = new PrismaClient();

  static async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  static async createUser(name: string, email: string, schoolId?: number) {
    return await this.prisma.user.create({
      data: {
        name,
        email,
        schoolId,
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

  static async getUserByEmail(email: string, schoolId: number) {
    return await this.prisma.user.findFirst({
      where: {
        email,
        schoolId
      }
    });
  }

  static async deleteUserByEmail(email: string, schoolId: number) {
    return await this.prisma.user.deleteMany({
      where: {
        email,
        schoolId
      },
    });
  }
}

export default User
