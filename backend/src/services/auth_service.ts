import { UserService } from "./user_service";
import { generateToken, verifyToken } from "../utils/jwt.utils";
import { hashPassword, comparePassword } from "../utils/password.utils";

export class AuthService {
  static async register(userData: {
    email: string;
    password: string;
    name: string;
  }) {
    // Verificar se usuário já existe
    const existingUser = await UserService.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash da senha
    const hashedPassword = await hashPassword(userData.password);
    console.log(hashPassword)

    // Criar usuário
    const user = await UserService.createUser({
      ...userData,
      password: hashedPassword
    });

    // Gerar token JWT
    const token = generateToken({ 
      userId: user.id, 
      email: user.email 
    });

    // Remover senha do retorno
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }

  static async login(email: string, password: string) {
    // Buscar usuário
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Validar senha
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Gerar token
    const token = generateToken({ 
      userId: user.id, 
      email: user.email 
    });

    // Remover senha do retorno
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }

  static async refreshToken(oldToken: string) {
    try {
      const decoded = verifyToken(oldToken);
      
      // Buscar usuário atualizado
      const user = await UserService.getUserByEmail(decoded.email);
      if (!user) {
        throw new Error("User not found");
      }

      // Gerar novo token
      const newToken = generateToken({ 
        userId: user.id, 
        email: user.email 
      });

      return { token: newToken };
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  static async logout(token: string) {
    // Aqui você pode adicionar lógica para blacklist tokens
    // Ou simplesmente o cliente remove o token do storage
    return { success: true };
  }
}

export default AuthService;