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


export const getUserByOtpAndEmail = async (otp: string, email: string): Promise<User | undefined> => {
    try {
        const user = await prisma.user.findUnique({
            where: { email, otp },
        });

        if (user) {
            return user;
        }

        return undefined;
    } catch (error) {
        throw error;
    }
};

export const createUser = async (data: Pick<User, 'email' | 'password' | 'phone' | 'address'>): Promise<User> => {
    try {
        return prisma.user.create({ data });
    } catch (error) {
        throw error
    }
};



export const updateUser = async (id: string, data: Partial<User>): Promise<User | undefined> => {
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data
        });

        return updatedUser
    } catch (error) {
        console.error('Error updating payment:', error);
    }
};