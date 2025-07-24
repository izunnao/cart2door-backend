import { startEmailJob } from "./jobs/email.crons.job.js";
import { loadCronJobs } from "./util.crons.js";

loadCronJobs()

export const registerAllCronJobs = () => {
    startEmailJob();
};

registerAllCronJobs();