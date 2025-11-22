import User from "../models/user";

export class UserService {
  static async getUserByEmail(email: string) {
    return await User.getUserByEmail(email);
  }

  static async createUser(userData: {
    email: string;
    senha: string;
    nome: string;
    matricula?: string;
  }) {
    return await User.createUser(userData.nome, userData.email, userData.senha);
  }
}

export default UserService;