import cron from 'node-cron';
import { SendMailOptions } from '../../notification/types.js';
import { logger } from '../../utils/logger.js';
import { sendMail } from '../../notification/services.js';

const queue: SendMailOptions[] = [];

// Add a job to the queue
export const queueEmailPayloads = (payload: SendMailOptions) => {
    console.log('queueEmailPayloads: payload', payload);
    queue.push(payload);
    console.log('queue length > ', queue.length);
};

// Process the queue
export const sendQueuedEmails = async () => {
    logger.info(`[CRON] - sendQueuedEmails: Payload queue ${queue.length}`);
    while (queue.length > 0) {
        const payload = queue.shift();
        if (payload) {
            try {
                logger.info(`[CRON] - sendQueuedEmails ${JSON.stringify(payload)}`);
                await sendMail(payload)
            } catch (err) {
                queue.push(payload);
                console.error('Email job failed:', err);
            }
        }
    }
};

export const getMailQueue = () => queue
export const reloadEmailPayloadsFromDb = (payloads: SendMailOptions[]) => {
    const deepCopy = structuredClone(payloads);
    queue.push(...deepCopy)
}

export const startEmailJob = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        logger.info(`[CRON] Running email dispatch at ${new Date().toISOString()}`);
        await sendQueuedEmails(); // process your queue
    });
};