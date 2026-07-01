import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import url from 'url';
import config from './config/index.js';
import apiRouter from './routes/index.js';
import { runMigrations } from './database/migrations/index.js';
import { runSeeds } from './database/seed/index.js';
import { handlePredictStreamConnection } from './services/predictStream.js';
import { sendNotFound } from './utils/response.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route mapping
app.use('/api/v1', apiRouter);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SignLens Mobile Gateway API',
    timestamp: new Date().toISOString(),
  });
});

// 404 fallback route
app.use((req, res) => {
  sendNotFound(res, `Cannot ${req.method} ${req.originalUrl}`);
});

const server = http.createServer(app);

// WebSocket server without standalone listening
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', handlePredictStreamConnection);

// Upgrade logic to handoff predict-stream WebSocket connections
server.on('upgrade', (request, socket, head) => {
  const parsedUrl = url.parse(request.url);
  const pathname = parsedUrl.pathname;

  if (pathname === '/api/v1/predict-stream') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Boot and database synchronization routine
const startServer = async () => {
  try {
    // Check and update database schemas and seeds
    await runMigrations();
    await runSeeds();

    server.listen(config.port, () => {
      console.log(`==================================================`);
      console.log(`🚀 SignLens Mobile Gateway Backend successfully started!`);
      console.log(`📡 Listening on http://localhost:${config.port}`);
      console.log(`🔗 WS endpoint: ws://localhost:${config.port}/api/v1/predict-stream`);
      console.log(`==================================================`);
    });
  } catch (err) {
    console.error('Fatal server boot failure:', err);
    process.exit(1);
  }
};

startServer();
export default app;
