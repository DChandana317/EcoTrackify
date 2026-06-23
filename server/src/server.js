import dns from 'node:dns/promises';
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import http from 'http';
import app from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { startAgenda } from './jobs/agenda.js';

const server = http.createServer(app);
let agendaInstance = null;
let isShuttingDown = false;

const gracefulShutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`\n${signal} received. Starting graceful shutdown...`);

  return new Promise((resolve) => {
    server.close(async () => {
      console.log('✅ HTTP server closed');
      
      try {
        if (agendaInstance) {
          await agendaInstance.stop();
          console.log('✅ Agenda jobs stopped');
        }
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
      resolve();
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error('⚠️ Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  });
};

const start = async () => {
  try {
    await connectDb();
    agendaInstance = await startAgenda();

    server.listen(env.port, () => {
      console.log(`🚀 API ready on port ${env.port}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${env.port} is already in use.`);
        console.error(`   Waiting 2 seconds and retrying...`);
        setTimeout(() => {
          server.listen(env.port);
        }, 2000);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();

export default server;
