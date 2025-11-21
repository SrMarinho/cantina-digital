export const hashPassword = async (password: string): Promise<string> => {
    const bcrypt = await import('bcrypt');
    const secretKey = process.env.JWT_SECRET || 'default_secret_key';
    const hashedPassword = await bcrypt.hash(password + secretKey, 10);
    return hashedPassword;
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const bcrypt = await import('bcrypt');
    const secretKey = process.env.JWT_SECRET || 'default_secret_key';
    return await bcrypt.compare(password + secretKey, hashedPassword);
}