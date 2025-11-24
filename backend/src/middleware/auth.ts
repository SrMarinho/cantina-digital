import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface AuthRequest extends Request {
    user?: any
}

class AuthMiddleware {
    static authenticateToken(request: AuthRequest, response: Response, next: NextFunction) {
        const authorization = request.headers["authorization"]
        let token = null
        if (authorization) {
            token = authorization.replace("Bearer ", "").trim()
        }
        if (!token) {
            return response.status(401).json({message: "Token de acesso requerido"})
        }

        try {
            const secret = process.env.JWT_SECRET
            if (!secret) {
                throw new Error("JWT_SECRET não configurado")
            }
            const decoded = jwt.verify(token, secret)
            request.user = decoded
            next()
        } catch (error) {
            return response.status(401).json({message: "Token inválido ou expirado"})        
        }
    }
}

export default AuthMiddleware.authenticateToken