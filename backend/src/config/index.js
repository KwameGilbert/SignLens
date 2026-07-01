import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize dotenv in config loader to ensure variables are loaded in correct sequence
dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredEnv = ['SECRET_KEY'];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);

if (missingEnv.length > 0) {
  console.warn(`[WARNING] Missing recommended environment variables: ${missingEnv.join(', ')}. Server may malfunction.`);
}

export const config = {
  port: parseInt(process.env.PORT || '8001', 10),
  secretKey: process.env.SECRET_KEY || 'default_secret_key_fallback_should_not_use_in_prod',
  jwtExpiry: process.env.JWT_EXPIRY || '30d',
  mlModelUrl: process.env.MODEL_API_URL || 'http://127.0.0.1:8000',
  mlModelWsUrl: process.env.MODEL_API_WS_URL || 'ws://127.0.0.1:8000',
  mlModelApiKey: process.env.MODEL_API_KEY || '',
  highConfidenceThreshold: parseFloat(process.env.HIGH_CONFIDENCE_THRESHOLD || '0.8'),
};

export default config;
