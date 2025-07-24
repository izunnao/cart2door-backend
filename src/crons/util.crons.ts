import { SendMailOptions } from "../notification/types.js";
import { logger } from "../utils/logger.js";
import { getMailQueue, reloadEmailPayloadsFromDb } from "./jobs/email.crons.job.js"
import { getJob, createJob, updateJob, deleteJob } from "./repo.crons.js";

export const storeCronJobs = async () => {
    logger.info('[CRON] - storeCronJobs: Started')

    try {
        const mailQueue = getMailQueue();
        if (mailQueue?.length > 0) {
            const job = await getJob('email')
            if (job) {
                await updateJob('email', mailQueue)
            } else {
                await createJob('email', mailQueue)
            }
        }

        logger.info('[CRON] - storeCronJobs: Ended')
    } catch (error) {
        logger.error('[CRON - storeCronJobs: Failed')
    }
}

export const loadCronJobs = async () => {
    logger.info('[CRON] - loadCronJobs: started')

    try {
        const job = await getJob('email')
        if (job) {
            reloadEmailPayloadsFromDb(job.payload as unknown as SendMailOptions[])
            await deleteJob('email')
        }
    } catch (error) {
        logger.error(`[CRON - loadCronJobs: Failed, ${JSON.stringify(error)}`)
    }
    logger.info('[CRON] - loadCronJobs: ended')
}