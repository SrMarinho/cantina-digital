import { Request, Response } from "express";
import User from "../models/user";

class UsersController {
    static async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await User.getAllUsers();
            res.status(201).json({
                success: true,
                data: users
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: "Failed to fetch users"
            });
        }
    }

    static async createUser(req: Request, res: Response): Promise<void> {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                error: "Name, email, and password are required"
            });
            return;
        }

        try {
            const newUser = await User.createUser(name, email, password);
            res.status(201).json({
                success: true,
                data: {
                    id: newUser.id,
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: "Failed to create user"
            });
        }
    }

    public static getUserByEmail(email: string) {
        return User.getUserByEmail(email);
    }

    public static deleteUserByEmail(email: string) {
        return User.deleteUserByEmail(email);
    }
}

export default UsersController;