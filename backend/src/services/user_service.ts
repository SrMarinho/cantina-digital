import User from "../models/user";

export class UserService {
  static async getUserByEmail(email: string) {
    return await User.getUserByEmail(email);
  }

  static async createUser(userData: {
    email: string;
    password: string;
    name: string;
  }) {
    // Aqui você pode adicionar hash da senha, validações, etc.
    return await User.createUser(userData.name, userData.email, userData.password);
  }

  static async validatePassword(user: any, password: string): Promise<boolean> {
    // Lógica de validação de senha (comparar hash)
    return user.password === password; // Substituir por bcrypt
  }
}

export default UserService;