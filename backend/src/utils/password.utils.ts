export const hashPassword = async (password: string): Promise<string> => {
    const bcrypt = await import('bcrypt');
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return await bcrypt.hash(password + secretKey, 10);
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const bcrypt = await import('bcrypt');
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return await bcrypt.compare(password + secretKey, hashedPassword);
}