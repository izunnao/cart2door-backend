
import './register.crons.js';
import { parentPort } from 'worker_threads';
import { queueEmailPayloads } from "./jobs/email.crons.job.js";
import { SendMailOptions } from '../notification/types.js';
import { storeCronJobs } from './util.crons.js';
import { logger } from '../utils/logger.js';

parentPort?.on('message', async (message: { for: 'email' | 'save', data: SendMailOptions | any }) => {
    logger.info('[CRON]: on-message: for ', message.for)

    if (message.for === 'email') {
        queueEmailPayloads(message.data)
    }

    if (message.for === 'save') {
        await storeCronJobs();
        parentPort?.postMessage({ for: 'save:done' })
    }
});