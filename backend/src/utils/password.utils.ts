import "dotenv/config";
import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 12; // Aumente para maior segurança
    return await bcrypt.hash(password, saltRounds);
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}