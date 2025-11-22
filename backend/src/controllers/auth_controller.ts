import { Request, Response } from "express";
import { AuthService } from "../services/auth_service";

class AuthController {
  static async register(request: Request, response: Response): Promise<void> {
    try {
      const { email, password, name } = request.body;

      // Validações básicas
      if (!email || !password || !name) {
        response.status(400).json({
          success: false,
          error: "Email, password and name are required"
        });
        return;
      }

      const result = await AuthService.register({ email, password, name });

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
      const { email, password } = request.body;

      if (!email || !password) {
        response.status(400).json({
          success: false,
          error: "Email and password are required"
        });
        return;
      }

      const result = await AuthService.login(email, password);

      response.status(200).json(result);
    } catch (error: any) {
      response.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  static async logout(request: Request, response: Response): Promise<void> {
    try {
      const token = request.header('Authorization')?.replace('Bearer ', '');
      
      if (token) {
        await AuthService.logout(token);
      }

      response.status(200).json({
        success: true,
        message: "Logged out successfully"
      });
    } catch (error: any) {
      response.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async refreshToken(request: Request, response: Response): Promise<void> {
    try {
      const { token } = request.body;

      if (!token) {
        response.status(400).json({
          success: false,
          error: "Token is required"
        });
        return;
      }

      const result = await AuthService.refreshToken(token);

      response.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      response.status(401).json({
        success: false,
        error: error.message
      });
    }
  }
}

export default AuthController;