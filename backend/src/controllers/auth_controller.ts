import { Request, Response } from "express";
import { AuthService } from "../services/auth_service";

class AuthController {
  static async register(request: Request, response: Response): Promise<void> {
    try {
      const { email, senha, nome, matricula } = request.body;

      // Validações básicas
      if (!email || !senha || !nome) {
        response.status(400).json({
          success: false,
          error: "Email, senha e nome são obrigatórios"
        });
        return;
      }

      const result = await AuthService.register({ email, senha, nome, matricula });

      response.status(201).json(result);
    } catch (error: any) {
      response.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async login(request: Request, response: Response): Promise<void> {
    try {
      const { email, senha } = request.body;

      if (!email || !senha) {
        response.status(400).json({
          success: false,
          error: "Email e senha são obrigatórios"
        });
        return;
      }

      const result = await AuthService.login(email, senha);

      response.status(200).json(result);
    } catch (error: any) {
      response.status(401).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default AuthController;