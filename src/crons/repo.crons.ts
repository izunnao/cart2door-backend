import { Job } from "@prisma/client"
import { prisma } from "../database/prisma_config.js"

export const saveJobsToDB = async (type: string, data: any | any[]) => {
    try {
        await prisma.job.create({ data: { type, payload: data } })
    } catch (error) {
        console.log(error)
    }
}



export const getJobsFromDB = async (type: string): Promise<Job | undefined> => {
    try {
        const job = await prisma.job.findFirst({ where: { type } })

        if (!job) {
            return undefined
        }

        return job;
    } catch (error) {
        console.log(error)
    }
}