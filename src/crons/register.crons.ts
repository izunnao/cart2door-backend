import { startEmailJob } from "./jobs/email.crons.job.js";

export const registerAllCronJobs = () => {
    startEmailJob();
};

registerAllCronJobs();