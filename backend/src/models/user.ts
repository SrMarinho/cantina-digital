import { PrismaClient } from "@prisma/client";

class User {
  private static prisma: PrismaClient = new PrismaClient();

  static async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  static async createUser(school_id: number, name: string, email: string, password: string, ): Promise<any> {
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
        throw new Error("USER_ALREADY_EXISTS");
    }

    return await this.prisma.user.create({
      data: {
        school_id,
        name,
        email,
        password,
      },
    });
  }

  static async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  static async deleteUserByEmail(email: string) {
    return await this.prisma.user.delete({
      where: {
        email,
      },
    });
  }
}

export default User;