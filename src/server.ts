// should always be at the top to load env
import dotenv from 'dotenv';
dotenv.config();


import { app } from './app.js';
import './crons/main.crons.js';
import { CONFIG_PORT } from './config.js';
import { processHandler } from './processHandler.js';


export const server = app.listen(CONFIG_PORT, () => {
  console.log(`🚀 Server running on port ${CONFIG_PORT}`);
});


processHandler(server);
