import { Job } from "@prisma/client"
import { prisma } from "../database/prisma_config.js"

export const createJob = async (type: string, data: any | any[]) => {
    try {
        await prisma.job.create({ data: { type, payload: data } })
    } catch (error) {
        console.error(error)
    }
}


export const updateJob = async (type: string, data: any | any[]) => {
    try {
        await prisma.job.update({ where: { type }, data: { payload: data, updatedAt: new Date() } })
    } catch (error) {
        console.error(error)
    }
}


export const getJob = async (type: string): Promise<Job | undefined> => {
    try {
        const job = await prisma.job.findFirst({ where: { type } })

        if (!job) {
            return undefined
        }

        return job;
    } catch (error) {
        console.error(error)
    }
}


export const deleteJob = async (type: string): Promise<Job | undefined> => {
    try {
        const job = await prisma.job.delete({ where: { type } })

        if (!job) {
            return undefined
        }

        return job;
    } catch (error) {
        console.error(error)
    }
}