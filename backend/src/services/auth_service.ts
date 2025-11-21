import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

class AuthService {
  static async login(email: string, password: string) {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const secretKey = process.env.JWT_SECRET

    if (!secretKey) {
      throw new Error('Chave secreta não definida');
    }

    const hashedPassword = await bcrypt.hash(password + secretKey, 10);

    // Verificar senha
    const validPassword = await bcrypt.compare(hashedPassword, user.password);
    if (!validPassword) {
      throw new Error('Senha incorreta');
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retornar usuário sem senha e token
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  }

  static async register(name: string, email: string, password: string) {
    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER' // Role padrão
      }
    });

    // Gerar token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retornar usuário sem senha e token
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }

  static async verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      throw new Error('Token inválido');
    }
  }
};

export default AuthService;