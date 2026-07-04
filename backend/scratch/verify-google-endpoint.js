import { googleLogin } from '../src/controller/auth.controller.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log("Starting verification of googleLogin controller...");

// Mock req and res
const mockReq = {
  body: {
    idToken: "invalid-mock-token-12345"
  }
};

const mockRes = {
  statusCode: 200,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    this.jsonData = data;
    console.log(`Response status: ${this.statusCode}`);
    console.log(`Response body:`, JSON.stringify(data, null, 2));
    
    const resStr = JSON.stringify(data);
    if (this.statusCode === 401 && resStr.includes("Invalid Google ID token")) {
      console.log("✅ SUCCESS: The controller rejected the invalid Google token as expected!");
      process.exit(0);
    } else {
      console.error("❌ FAILURE: Unexpected response status or body", this.statusCode, data);
      process.exit(1);
    }
  }
};

// Execute googleLogin
googleLogin(mockReq, mockRes).catch(err => {
  console.error("❌ Execution error:", err);
  process.exit(1);
});
