import { PrismaClient } from '@prisma/client'

class User {
    private prisma: PrismaClient;
    constructor() {
        this.prisma = new PrismaClient();
    }

    static async createUser(name: string, email: string) {
        await prisma.user.create({
            data: {
            name: 'Alice',
            email: 'alice@prisma.io',
            posts: {
                create: { title: 'Hello World' },
            },
            profile: {
                create: { bio: 'I like turtles' },
            },
            },
        })
    }