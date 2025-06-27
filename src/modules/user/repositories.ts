import { prisma } from "../../database/prisma_config.js"
import { UserI } from "../../types/user.types.js";

export const getUserByEmail = async (email: string): Promise<UserI | undefined> => {
    try {
        const user = await prisma.user.findUnique({ where: { email } })

        if(user){
            return user
        }

        return undefined;
    } catch (error) {
        throw error
    }
}

export const createUser = async (email: string, password: string): Promise<UserI>  => {
    try {
        return prisma.user.create({
            data: {
                email,
                password,
            },
        });
    } catch (error) {
        throw error
    }
};