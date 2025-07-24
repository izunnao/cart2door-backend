import { IncomingMessage, Server, ServerResponse } from 'http';
import { prisma } from "./database/prisma_config.js";
import cronsWorker from './crons/main.crons.js';


let isShuttingDown = false;

function shutdown(server: Server<typeof IncomingMessage, typeof ServerResponse>) {
    console.log('is shutting down ???? ', isShuttingDown);
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log('\n🔄 Gracefully shutting down...');



    
        // prisma.$disconnect().then(() => console.log('prisma disconnected...')).catch((err) => console.error('Prisma disconnect failed:', err))
        // new Promise((res) => {
        //     console.log('Server....')
        //     if (server && server.close) server.close(res); // HTTP server
        //     else res(null);
        // })
        // new Promise<void>((resolve, reject) => {
        //     const timeout = setTimeout(() => reject(new Error('Cron worker save timeout')), 5000);

        //     function handleMessage(msg: any) {
        //         if (msg?.for === 'save:done') {
        //             console.log(' --------------------   completed saving ----------------------')
        //             clearTimeout(timeout);
        //             cronsWorker.off('message', handleMessage); // clean up
        //             resolve();
        //         }
        //     }

        //     cronsWorker.on('message', handleMessage);
        //     cronsWorker.postMessage({ for: 'save' });
        // })




    Promise.all([
        prisma.$disconnect().then(() => console.log('prisma disconnected...')).catch((err) => console.error('Prisma disconnect failed:', err)),
        new Promise((res) => {
            console.log('Server....')
            if (server && server.close) server.close(res); // HTTP server
            else res(null);
        }),
        new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Cron worker save timeout')), 5000);

            function handleMessage(msg: any) {
                if (msg?.for === 'save:done') {
                    console.log(' --------------------   completed saving ----------------------')
                    clearTimeout(timeout);
                    cronsWorker.off('message', handleMessage); // clean up
                    resolve();
                }
            }

            cronsWorker.on('message', handleMessage);
            cronsWorker.postMessage({ for: 'save' });
        }),
    ])
        .then(() => {
            console.log('✅ Shutdown complete.');
            process.exit(0);
        })
        .catch((err) => {
            console.error('❌ Error during shutdown:', err);
            process.exit(1);
        });
}


function handleException(error: Error, server: Server<typeof IncomingMessage, typeof ServerResponse>) {
    console.error('🔥 Uncaught Exception:', error);
    shutdown(server);
}

function handleRejection(reason: any, server: Server<typeof IncomingMessage, typeof ServerResponse>) {
    console.error('🔥 Unhandled Promise Rejection:', reason);
    shutdown(server);
}

export const processHandler = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
    process.on('SIGINT', () => shutdown(server));
    process.on('SIGTERM', () => shutdown(server));
    process.on('uncaughtException', (error: Error) => handleException(error, server));
    process.on('unhandledRejection', (reason: any) => handleRejection(reason, server));
}
