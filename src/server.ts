import { Worker } from 'worker_threads';
import { app } from './app.js';
import { CONFIG_PORT } from './config.js';
import { processHandler } from './processHandler.js';

export let emailWorker: Worker;

export const server = app.listen(CONFIG_PORT, () => {
  console.log(`🚀 Server running on port ${CONFIG_PORT}`);

  try {
    console.log('starting worker')
    emailWorker = new Worker(
      new URL('./crons/worker.crons', import.meta.url),
      { execArgv: ['--loader', 'ts-node/esm'] }
    );

  } catch (error) {
    console.log('work error ', error);
  }
});


processHandler(server);
