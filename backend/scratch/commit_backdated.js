import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../..'); // Root folder where .git is located

function runCmd(cmd) {
  try {
    console.log(`Running: ${cmd}`);
    return execSync(cmd, { cwd: rootDir, encoding: 'utf8' });
  } catch (err) {
    console.error(`Error running command: ${cmd}`);
    console.error(err.stdout || err.stderr || err.message);
    throw err;
  }
}

function commitStandard(filePath, message) {
  try {
    // Stage the file
    runCmd(`git add "${filePath}"`);
    
    // Commit normally
    console.log(`Committing: ${message}`);
    execSync(`git commit -m "${message}"`, {
      cwd: rootDir,
    });
  } catch (err) {
    console.warn(`⚠️ Failed to commit file: ${filePath}. Skipping...`);
  }
}

// Staging and committing files sequentially
const filesToCommit = [
  // Day 1 equivalent
  { path: 'backend/.env.example', action: 'updated' },
  { path: 'backend/README.md', action: 'updated' },
  { path: 'backend/requirements.txt', action: 'deleted' },
  { path: 'backend/mobile_backend_architecture.md', action: 'deleted' },
  { path: 'backend/package.json', action: 'created' },
  { path: 'backend/pnpm-lock.yaml', action: 'created' },

  // Day 2 equivalent
  { path: 'backend/src/config/db.js', action: 'created' },
  { path: 'backend/src/config/index.js', action: 'created' },
  { path: 'backend/src/database/migrations/index.js', action: 'created' },
  { path: 'backend/src/database/seed/index.js', action: 'created' },
  { path: 'backend/src/utils/helpers.js', action: 'created' },
  { path: 'backend/src/utils/response.js', action: 'created' },

  // Day 3 equivalent
  { path: 'backend/src/model/user.js', action: 'created' },
  { path: 'backend/src/model/history.js', action: 'created' },
  { path: 'backend/src/middleware/auth.js', action: 'created' },
  { path: 'backend/src/services/upload.js', action: 'created' },
  { path: 'backend/src/services/mlClient.js', action: 'created' },
  { path: 'backend/src/services/predictStream.js', action: 'created' },

  // Day 4 equivalent
  { path: 'backend/src/controller/auth.js', action: 'created' },
  { path: 'backend/src/controller/history.js', action: 'created' },
  { path: 'backend/src/controller/predict.js', action: 'created' },
  { path: 'backend/src/routes/auth.js', action: 'created' },
  { path: 'backend/src/routes/history.js', action: 'created' },
  { path: 'backend/src/routes/predict.js', action: 'created' },
  { path: 'backend/src/routes/index.js', action: 'created' },
  { path: 'backend/src/main.js', action: 'created' },
  { path: 'backend/scratch/verify.js', action: 'created' }
];

function main() {
  console.log('Starting standard sequential commits...');
  
  for (const file of filesToCommit) {
    commitStandard(file.path, `${file.action} ${file.path}`);
  }

  console.log('\nAll commits created successfully!');
  console.log('Pushing changes to remote repository...');
  try {
    runCmd('git push');
    console.log('🚀 Pushed successfully to remote!');
  } catch (err) {
    console.error('❌ Failed to push commits. Please push manually.');
  }
}

main();
