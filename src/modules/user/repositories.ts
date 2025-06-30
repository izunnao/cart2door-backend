import { User } from '@prisma/client';

import { prisma } from "../../database/prisma_config.js"
// import { UserI } from "../../types/user.types.js";

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    try {
        const user = await prisma.user.findUnique({ where: { email } })

        if (user) {
            return user
        }

        return undefined;
    } catch (error) {
        throw error
    }
}

export const createUser = async (data: Pick<User, 'email' | 'password' | 'phone' | 'address'>): Promise<User> => {
    try {
        return prisma.user.create({ data });
    } catch (error) {
        throw error
    }
};