import { UserService } from "./user_service";
import { generateToken } from "../utils/jwt.utils";
import { hashPassword, comparePassword } from "../utils/password.utils";

export class AuthService {
  static async register(userData: {
    email: string;
    senha: string;
    nome: string;
    matricula?: string;
  }) {
    // Verificar se usuário já existe
    const existingUser = await UserService.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await hashPassword(userData.senha);

    // Criar usuário
    const user = await UserService.createUser({
      ...userData,
      senha: hashedPassword
    });


    // Gerar token JWT
    const token = generateToken({ 
      userId: user.id, 
      email: user.email 
    });

    const user_return = {
      userId: user.id.toString(),
      message: "Usuário registrado com sucesso",
    }

    return {
      user: user_return,
      token
    };
  }

  static async login(email: string, senha: string) {
    // Buscar usuário
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }


    const isPasswordValid = await comparePassword(senha, user.senha_hash);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Gerar token
    const token = generateToken({ 
      userId: user.id, 
      email: user.email 
    });

    const user_return = {
      userId: user.id.toString(),
      nome: user.nome,
      email: user.email,
    }

    return {
      user: user_return,
      token
    };
  }
}