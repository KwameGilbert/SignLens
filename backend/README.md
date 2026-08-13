# ⚡ SignLens Backend Gateway Subsystem
## Node.js Express API Gateway, Database Setup & XAMPP Integration Guide

Welcome to the **SignLens Backend Gateway Subsystem**. This server acts as the central API Gateway and security layer for the entire SignLens platform. It manages user authentication (JWT & bcrypt), database transactions via Knex.js ORM, translation history logging, Cloudinary media management, Learning Management System (LMS) courses, and proxies prediction payloads to the Python ML server.

---

## 📁 1. Directory Structure Overview

```
SignLens/backend/
├── src/
│   ├── config/             # Environment & Knex database configuration
│   ├── controller/         # Express route handlers (auth, predict, history, lesson, quiz, user)
│   ├── database/           # Database migration & seed files
│   │   ├── migrations/     # Knex SQL table creation schemas
│   │   └── seed/           # Seed data for lessons, quizzes, badges
│   ├── docs/               # Swagger OpenAPI documentation JSON specifications
│   ├── middleware/         # Auth verification middleware (JWT validation)
│   ├── model/              # Database models (Knex/SQL wrappers)
│   ├── routes/             # Express API route declarations
│   ├── services/           # ML Proxy client (mlClient.service.js) & WebSocket stream service
│   └── main.js             # Express application entry point
├── .env.example            # Environment variable template
├── knexfile.js             # Knex.js database connection config
└── package.json            # Node.js dependencies & execution scripts
```

---

## 🛠️ 2. Step-by-Step Installation & Local Setup

### Step 2.1: Prerequisites
Ensure **Node.js (v18.0.0 or higher)** and a local SQL database server (**XAMPP with MySQL** or **PostgreSQL**) are installed.

---

### Step 2.2: Local Database Setup (Choose Option A or Option B)

#### Option A: Using XAMPP (MySQL / phpMyAdmin) - Recommended for Beginners
1. Open the **XAMPP Control Panel**.
2. Click **Start** next to **Apache** and **MySQL**.
3. Open your web browser and navigate to: **`http://localhost/phpmyadmin`**
4. In phpMyAdmin, click **Databases** from the top menu bar.
5. In the **Database name** box, type `signlens_mobile`.
6. Select `utf8mb4_general_ci` as collation and click **Create**.

#### Option B: Using PostgreSQL
1. Open **pgAdmin** or your PostgreSQL command prompt (`psql`).
2. Run the SQL command:
   ```sql
   CREATE DATABASE signlens_mobile;
   ```

---

### Step 2.3: Environment Configuration (`.env` File Setup)

Navigate to the `backend/` directory in Command Prompt / Terminal and create your local `.env` configuration file:

#### Windows (Command Prompt):
```cmd
cd backend
copy .env.example .env
```

#### macOS / Linux / PowerShell:
```bash
cd backend
cp .env.example .env
```

#### Open `backend/.env` in any text editor and configure your variables:
```env
# Server Port
PORT=8001

# Secret Key for JWT Tokens
SECRET_KEY=super_secret_signing_key_for_signlens_mobile_app_1234567890

# Database Configuration (For PostgreSQL or MySQL)
PGHOST=localhost
PGPORT=5432
PGDATABASE=signlens_mobile
PGUSER=postgres
PGPASSWORD=postgres

# Machine Learning Subsystem Connection
MODEL_API_URL=http://127.0.0.1:8000
MODEL_API_WS_URL=ws://127.0.0.1:8000
MODEL_API_KEY=signlens_internal_api_key
```

---

### Step 2.4: Install Dependencies & Run Database Migrations

In your terminal (inside the `backend/` folder), execute:

```bash
# 1. Install Node.js packages
npm install

# 2. Run Database Migrations (Creates tables: users, histories, lessons, quizzes, badges)
npm run migrate

# 3. Seed Database with initial sign language lessons and categories
npm run seed
```

---

## 🚀 3. Starting the Backend Server

To start the backend in development mode (with auto-reload enabled):

```bash
npm run dev
```

### Verification:
1. Terminal will display: `Server running on port 8001`.
2. Open your browser to: **`http://localhost:8001/api-docs`**
3. You will see the **Swagger Interactive API Documentation** listing all available REST endpoints.

---

## 🧪 4. Key Available API Routes

- **Auth Routes (`/api/v1/auth`):**
  - `POST /register`: User signup with bcrypt password hashing.
  - `POST /login`: User login returning stateless JWT token.
  - `POST /google`: Google OAuth ID Token verification.
- **Prediction Proxy (`/api/v1/predict`):**
  - `POST /predict?type=image`: Forwards static image to Python ML server (`Port 8000`).
  - `POST /predict?type=video`: Forwards video clip to Python ML server.
  - `WS /predict-stream`: Duplex WebSocket streaming route.
- **LMS Routes (`/api/v1/lessons`, `/api/v1/quizzes`, `/api/v1/badges`):**
  - `GET /lesson-categories`: Fetch sign language course categories.
  - `GET /lessons/:id`: Fetch sign language video tutorial details.
  - `GET /quizzes/category/:categoryId`: Interactive quiz questions.
- **Translation History (`/api/v1/history`):**
  - `GET /history`: Fetch user's translation log history.

---

## ❓ 5. Common Backend Issues & Troubleshooting

### 🚨 Problem 1: `connect ECONNREFUSED 127.0.0.1:5432` or MySQL Connection Error
* **Cause:** The database service (XAMPP MySQL or PostgreSQL) is not running.
* **Solution:** Open XAMPP Control Panel and click **Start** next to MySQL. Ensure the database `signlens_mobile` exists in phpMyAdmin.

### 🚨 Problem 2: `Error: Migration directory is corrupt or missing`
* **Cause:** `knexfile.js` cannot locate the migration folder.
* **Solution:** Ensure you execute `npm run migrate` from inside the `backend/` directory root.

### 🚨 Problem 3: `Error: ML backend returned an empty or invalid prediction response`
* **Cause:** The Python FastAPI ML server (`Port 8000`) is not running.
* **Solution:** Start the ML server first by following the instructions in [model/README.md](file:///c:/Users/JOSHUA%20ASEMANI/Music/SignLens/SignLens/model/README.md).
