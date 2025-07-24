import { SendMailOptions } from "../notification/types.js";
import { logger } from "../utils/logger.js";
import { getMailQueue, queueEmailPayloads, reloadEmailPayloadsFromDb } from "./jobs/email.crons.job.js"
import { getJobsFromDB, saveJobsToDB } from "./repo.crons.js";

export const storeCronJobs = async () => {

    try {
        logger.info('[CRON] - storeCronJobs: Started')

        const mailQueue = getMailQueue();
        if (mailQueue.length > 0) {
            await saveJobsToDB('email', mailQueue)
        }

        logger.info('[CRON] - storeCronJobs: Ended')
    } catch (error) {
        logger.error('[CRON - storeCronJobs: Failed')
    }
}





export const loadCronJobs = async () => {
    try {
        const job = await getJobsFromDB('email')
        if(job){
            reloadEmailPayloadsFromDb(job.payload as unknown as SendMailOptions[])
        }
    } catch (error) {
        logger.error(`[CRON - loadCronJobs: Failed, ${JSON.stringify(error)}`)
    }
}