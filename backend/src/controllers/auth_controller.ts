import { Request, Response } from "express"


class AuthControllers {
    static async register(request: Request, response: Response): Promise<void> {
        response.status(201).json({message: "Usuário registrado com sucesso"})
    }

    static async login(request: Request, response: Response): Promise<void> {
        response.status(200).json({message: "Usuário logado com sucesso"})
    }

    static async logout(request: Request, response: Response): Promise<void> {
        response.status(200).json({message: "Usuário deslogado com sucesso"})
    }

    static async refreshToken(request: Request, response: Response): Promise<void> {
        response.status(200).json({message: "Token atualizado com sucesso"})
    }
}

export default AuthControllers;