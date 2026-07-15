import knex from 'knex';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432', 10),
    database: process.env.PGDATABASE || 'signlens_mobile',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    ssl: process.env.PGHOST && process.env.PGHOST.includes('neon.tech') 
      ? { rejectUnauthorized: false } 
      : false,
  },
  pool: {
    min: 2,
    max: 20,
    propagateCreateError: false,
  },
});

export default db;
