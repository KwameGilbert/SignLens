import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import url from 'url';
import config from './config/index.js';
import apiRouter from './routes/index.route.js';
import { handlePredictStreamConnection } from './services/predictStream.service.js';
import { sendNotFound } from './utils/response.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI API Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve static uploaded files
app.use('/uploads', express.static('uploads'));

// Route mapping
app.use('/api', apiRouter);

// Basic health check endpoint
app.get('/', (req, res) => {
  const protocol = req.protocol;
  const host = req.get('host');
  res.json({
    status: 'ok',
    service: 'SignLens Mobile Gateway API',
    docs: `${protocol}://${host}/docs`,
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

  if (pathname === '/api/predict-stream' || pathname === '/predict-stream' || pathname === '/v1/predict-stream' || pathname === '/api/v1/predict-stream') {
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
    server.listen(config.port, () => {
      console.log(`==================================================`);
      console.log(`🚀 SignLens Mobile Gateway Backend successfully started!`);
      console.log(`📡 Listening on http://localhost:${config.port}`);
      console.log(`🔗 WS endpoint: ws://localhost:${config.port}/api/predict-stream`);
      console.log(`📖 API Documentation: http://localhost:${config.port}/docs`);
      console.log(`==================================================`);
    });
  } catch (err) {
    console.error('Fatal server boot failure:', err);
    process.exit(1);
  }
};

startServer();
export default app;
