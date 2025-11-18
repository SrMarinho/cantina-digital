import { PrismaClient } from '@prisma/client'

class User {
    private static prisma: PrismaClient = new PrismaClient();
    
    static async getAllUsers() {
        return await this.prisma.user.findMany();
    }

    static async createUser(name: string, email: string) {
        return await this.prisma.user.create({
            data: {
                name,
                email
            }
        });
    }

    static async getUserByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: {
                email
            }
        });
    }

    static async deleteUserByEmail(email: string) {
        return await this.prisma.user.delete({
            where: {
                email
            }
        });
    }
}