import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { Worker } from 'worker_threads';

// register('ts-node/esm', pathToFileURL('./'));

const cronsWorker = new Worker(new URL('./worker.crons', import.meta.url));

export default cronsWorker