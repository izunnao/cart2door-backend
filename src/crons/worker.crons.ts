import { parentPort } from 'worker_threads';
import { queueEmailPayloads, startEmailJob } from "./jobs/email.crons.job.js";
import { SendMailOptions } from '../notification/types.js';

export const registerAllCronJobs = () => {
    startEmailJob();
};

registerAllCronJobs();

parentPort?.on('message', (message: { for: 'email', data: SendMailOptions | any }) => {
    if (message.for === 'email') {
        queueEmailPayloads(message.data)
    }
});