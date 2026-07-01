import assert from 'assert';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../src/config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runVerification() {
  console.log('==================================================');
  console.log('🧪 Starting SignLens Express Backend Verification...');
  console.log('==================================================');

  // 1. Verify Configurations
  console.log('1. Checking configuration settings...');
  try {
    assert.strictEqual(typeof config.port, 'number', 'Port must be a number');
    assert.strictEqual(typeof config.secretKey, 'string', 'Secret Key must be a string');
    assert.strictEqual(typeof config.mlModelUrl, 'string', 'ML Model URL must be a string');
    console.log('   ✅ Configurations verified.');
  } catch (err) {
    console.error('   ❌ Configuration check failed:', err.message);
    process.exit(1);
  }

  // 2. Verify ESM Imports Integrity
  console.log('\n2. Testing module loading and integrity...');
  try {
    const UserModel = await import('../src/model/user.js');
    assert.ok(UserModel.default.findByEmail, 'UserModel should export findByEmail');
    assert.ok(UserModel.default.findById, 'UserModel should export findById');
    assert.ok(UserModel.default.create, 'UserModel should export create');
    console.log('   ✅ UserModel loaded successfully.');

    const HistoryModel = await import('../src/model/history.js');
    assert.ok(HistoryModel.default.create, 'HistoryModel should export create');
    assert.ok(HistoryModel.default.findByUserId, 'HistoryModel should export findByUserId');
    console.log('   ✅ HistoryModel loaded successfully.');

    const authController = await import('../src/controller/auth.js');
    assert.ok(authController.register, 'AuthController should export register');
    assert.ok(authController.login, 'AuthController should export login');
    console.log('   ✅ AuthController loaded successfully.');

    const historyController = await import('../src/controller/history.js');
    assert.ok(historyController.getHistory, 'HistoryController should export getHistory');
    assert.ok(historyController.createHistory, 'HistoryController should export createHistory');
    console.log('   ✅ HistoryController loaded successfully.');

    const predictController = await import('../src/controller/predict.js');
    assert.ok(predictController.predictImage, 'PredictController should export predictImage');
    console.log('   ✅ PredictController loaded successfully.');

    const authMiddleware = await import('../src/middleware/auth.js');
    assert.ok(authMiddleware.requireAuth, 'AuthMiddleware should export requireAuth');
    assert.ok(authMiddleware.requireAdmin, 'AuthMiddleware should export requireAdmin');
    console.log('   ✅ AuthMiddleware loaded successfully.');

    const mlClient = await import('../src/services/mlClient.js');
    assert.ok(mlClient.default.predictImage, 'MLClient should export predictImage');
    console.log('   ✅ MLClient service loaded successfully.');

    const uploadService = await import('../src/services/upload.js');
    assert.ok(uploadService.default.single, 'Upload service should export multer single upload middleware');
    console.log('   ✅ Multer Upload service loaded successfully.');

    const predictStreamService = await import('../src/services/predictStream.js');
    assert.ok(predictStreamService.handlePredictStreamConnection, 'predictStream service should export handlePredictStreamConnection');
    console.log('   ✅ WebSocket Relay service loaded successfully.');

    console.log('   ✅ All modules loaded without syntax or reference errors.');
  } catch (err) {
    console.error('   ❌ Module loading failed:', err.message);
    process.exit(1);
  }

  // 3. Graceful PostgreSQL connectivity check
  console.log('\n3. Probing PostgreSQL connection...');
  try {
        const dbModule = await import('../src/config/db.js');
    const db = dbModule.default;
    
    console.log(`   Probing PostgreSQL via Knex query builder...`);
    
    // Perform simple query with 2 second timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('PostgreSQL probe timed out')), 2000)
    );
    const queryPromise = db.raw('SELECT NOW()');
    
    const result = await Promise.race([queryPromise, timeoutPromise]);
    console.log('   ✅ PostgreSQL database connection probe succeeded.');
    console.log('   Timestamp from database:', result.rows[0].now || result.rows[0]);
    
    // Close knex instance
    await db.destroy();
  } catch (err) {
    console.log(`   ⚠️  PostgreSQL probe could not connect: ${err.message}`);
    console.log('      (This is expected if your local PostgreSQL server is not running or database is not created yet)');
    console.log('      (Please configure PG credentials in backend/.env to connect to your live database)');
  }

  console.log('\n==================================================');
  console.log('🎉 SignLens Express Backend modules load verification complete!');
  console.log('==================================================');
}

runVerification();
