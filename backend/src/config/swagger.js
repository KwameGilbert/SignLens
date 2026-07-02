import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readJson = (file) => {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', file), 'utf8'));
};

const schemas = readJson('schemas.json');
const auth = readJson('auth.json');
const history = readJson('history.json');
const predict = readJson('predict.json');
const lessonCategory = readJson('lessonCategory.json');
const lesson = readJson('lesson.json');
const quiz = readJson('quiz.json');
const badges = readJson('badges.json');
const admin = readJson('admin.json');

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "SignLens Gateway API",
    description: "Express.js gateway backend API service for the SignLens mobile application, facilitating user management, learning content delivery, achievements, and ML prediction relays.",
    version: "1.0.0",
    contact: {
      name: "Kwame Gilbert",
      email: "admin@signlens.com"
    }
  },
  servers: [
    {
      url: "http://localhost:8001/api",
      description: "Local Gateway Development Server"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter the JWT Bearer token returned from `/auth/login` or `/auth/register` to access secured endpoints."
      }
    },
    schemas: schemas
  },
  paths: {
    ...auth,
    ...history,
    ...predict,
    ...lessonCategory,
    ...lesson,
    ...quiz,
    ...badges,
    ...admin
  }
};

export default swaggerDocument;
