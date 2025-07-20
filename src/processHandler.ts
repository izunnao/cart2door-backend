import { IncomingMessage, Server, ServerResponse } from 'http';
import { prisma } from "./database/prisma_config.js";

function shutdown(server: Server<typeof IncomingMessage, typeof ServerResponse>) {
    console.log('\n🔄 Gracefully shutting down...');

    Promise.all([
        prisma.$disconnect().catch((err) => console.error('Prisma disconnect failed:', err)),
        new Promise((res) => {
            if (server && server.close) server.close(res); // HTTP server
            else res(null);
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
