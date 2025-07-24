import { Worker } from 'worker_threads';

const cronsWorker = new Worker(new URL('./worker.crons', import.meta.url));

export default cronsWorker