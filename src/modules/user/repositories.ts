import { Prisma, User } from '@prisma/client';

import { prisma } from "../../database/prisma_config.js"
import { PaginationI } from '../../types/general.types.js';
import { calcResponsePagination } from '../../utils/general.js';


interface GetUsersOptions {
    where?: Prisma.UserWhereInput;
    limit?: number;
    page?: number;    // 0-indexed
}

export const getUsers = async ({ where = {}, limit = 10, page = 0 }: GetUsersOptions): Promise<{ users: User[], pagination: PaginationI } | undefined> => {
    try {
        const skip = (page) * limit
        const users = await prisma.user.findMany({ where, take: limit, skip })

        const totalUsers = await prisma.user.count({
            where
        });

        if (users) {
            return {
                users,
                pagination: calcResponsePagination(totalUsers, limit, page)
            }
        }

        return undefined;
    } catch (error) {
        throw error
    }
}

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

export const createUser = async (data: Omit<User, 'id'>): Promise<User> => {
    try {
        return await prisma.user.create({ data });
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