import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import url from 'url';
import config from '../config/index.js';
import UserModel from '../model/user.js';
import HistoryModel from '../model/history.js';

export const handlePredictStreamConnection = async (ws, req) => {
  try {
    const parsedUrl = url.parse(req.url, true);
    const { token, type } = parsedUrl.query;

    if (!token || !type) {
      ws.close(1008, 'Missing token or type query parameters');
      return;
    }

    if (type !== 'video' && type !== 'stream') {
      ws.close(1003, 'Invalid type parameter. Must be video or stream');
      return;
    }

    // Authenticate the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, config.secretKey);
    } catch (err) {
      ws.close(1008, 'Invalid or expired JWT token');
      return;
    }

    const user = await UserModel.findById(decoded.id);
    if (!user || !user.is_active) {
      ws.close(1008, 'User account invalid or deactivated');
      return;
    }

    console.log(`WebSocket client authenticated: User ID ${user.id} starting stream relay (type: ${type})`);

    // Connect to the ML model WebSocket server
    const targetUrl = `${config.mlModelWsUrl}/api/v1/predict-stream?api_key=${config.mlModelApiKey}&type=${type}`;
    const mlWs = new WebSocket(targetUrl);

    // Queue for messages sent by the client before the ML connection opens
    const messageBuffer = [];

    mlWs.on('open', () => {
      console.log(`Connected to ML model server for User ID ${user.id}`);
      while (messageBuffer.length > 0) {
        const msg = messageBuffer.shift();
        mlWs.send(msg);
      }
    });

    mlWs.on('message', async (data) => {
      try {
        const messageString = data.toString();
        // Relay predictions directly back to the client
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(messageString);
        }

        const parsedRes = JSON.parse(messageString);
        // Save prediction if confidence exceeds the threshold and is not "Neutral"
        if (
          parsedRes &&
          parsedRes.prediction &&
          parsedRes.prediction !== 'Neutral' &&
          parsedRes.confidence >= config.highConfidenceThreshold
        ) {
                    await HistoryModel.create({
            userId: user.id,
            mode: 'camera',
            prediction: parsedRes.prediction,
            confidenceRating: parsedRes.confidence,
            resolutionStatus: parsedRes.confidence >= config.highConfidenceThreshold ? 'success' : 'low_confidence',
          });
        }
      } catch (err) {
        // Skip parsing errors (e.g., status/buffering text messages)
      }
    });

    mlWs.on('close', (code, reason) => {
      console.log(`ML model connection closed (code: ${code}). Closing client connection.`);
      ws.close(1000, 'ML backend closed connection');
    });

    mlWs.on('error', (err) => {
      console.error(`ML WebSocket Error for User ${user.id}:`, err.message);
      ws.close(1011, 'ML backend connection error');
    });

    ws.on('message', (message) => {
      if (mlWs.readyState === WebSocket.OPEN) {
        mlWs.send(message);
      } else {
        messageBuffer.push(message);
      }
    });

    ws.on('close', () => {
      console.log(`Client connection closed for User ID ${user.id}. Closing ML connection.`);
      if (mlWs.readyState === WebSocket.OPEN || mlWs.readyState === WebSocket.CONNECTING) {
        mlWs.close();
      }
    });

    ws.on('error', (err) => {
      console.error(`Client WebSocket Error for User ${user.id}:`, err.message);
      if (mlWs.readyState === WebSocket.OPEN || mlWs.readyState === WebSocket.CONNECTING) {
        mlWs.close();
      }
    });

  } catch (err) {
    console.error('Error handling WebSocket proxy connection:', err);
    ws.close(1011, 'Internal server error during handshake');
  }
};
