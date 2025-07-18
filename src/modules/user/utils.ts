import bcrypt from "bcryptjs";
import { BYCRYPT_SALT_ROUNDS } from "../../utils/constants.js";

export async function hashPassword(plainPassword: string): Promise<string> {
    try {
        const salt = await bcrypt.genSalt(BYCRYPT_SALT_ROUNDS);
        return await bcrypt.hash(plainPassword, salt);
    } catch (error) {
        console.error('Password hashing failed:', error);
        throw new Error('Password processing failed');
    }
}

export async function comparePasswords(
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        console.error('Password comparison failed:', error);
        return false;
    }
}