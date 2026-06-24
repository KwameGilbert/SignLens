# SignLens Mobile Gateway Backend Architecture Plan

This document outlines the architectural design and communication plan for the SignLens mobile application backend. It describes how the mobile app, the gateway backend, and the ML model prediction endpoints collaborate to provide secure, authenticated sign language recognition.

---

## 🗺️ System Architecture Overview

The system consists of two independent backend services:
1. **Model Prediction Server (`model/model_endpoints`)**: A high-performance Python FastAPI service dedicated purely to ML inference. It loads the heavy TensorFlow models (`.h5`) and performs keypoint extraction using MediaPipe.
2. **Mobile Gateway Backend (`backend/`)**: A secure, public-facing Python FastAPI service that handles customer accounts, authentication (JWT), translation history logging, and acts as a proxy/relay to the prediction server.

```mermaid
sequenceDiagram
    autonumber
    actor MobileApp as Mobile App Client
    participant Gateway as Mobile Gateway (Port 8001)
    participant MLServer as Model Endpoints Server (Port 8000)
    database DB as Gateway Database (SQLite/MySQL)

    rect rgb(240, 248, 255)
        note right of MobileApp: Authentication Flow
        MobileApp->>Gateway: POST /api/v1/auth/login (email, password)
        Gateway->>DB: Query user credentials
        DB-->>Gateway: Hashed password match
        Gateway-->>MobileApp: Return Access Token (JWT)
    end

    rect rgb(255, 245, 238)
        note right of MobileApp: Static Image Prediction Flow
        MobileApp->>Gateway: POST /api/v1/predict (Image File + JWT Header)
        Gateway->>Gateway: Validate JWT Token
        Gateway->>MLServer: POST /api/v1/predict (Image File + Private API Key)
        MLServer->>MLServer: Run CNN Inference
        MLServer-->>Gateway: Return Prediction (Label + Confidence)
        Gateway->>DB: Save prediction to User History table
        Gateway-->>MobileApp: Return Prediction (Label + Confidence)
    end

    rect rgb(240, 255, 240)
        note right of MobileApp: Real-Time WebSocket Streaming Flow
        MobileApp->>Gateway: Connect ws://.../predict-stream?token=JWT&type=stream
        Gateway->>Gateway: Validate JWT Token
        Gateway->>MLServer: Establish downstream WebSocket (with Private API Key)
        Gateway-->>MobileApp: Connection Accepted (Handshake complete)
        
        loop Stream Video Frames
            MobileApp->>Gateway: Send camera frame bytes
            Gateway->>MLServer: Forward frame bytes directly
            MLServer->>MLServer: Extract MediaPipe Keypoints & Predict via LSTM
            MLServer-->>Gateway: Return JSON prediction (Label + Confidence)
            Gateway->>MobileApp: Relay JSON prediction to client
            Note over Gateway,DB: If confidence > 80% and label changes, save to History DB
        end
    end
```

---

## 📂 Project Directory Structure

Here is the combined view of the directory structure under your workspace root:

```text
SignLens/
├── backend/                       # NEW: Mobile App Backend Gateway (Port 8001)
│   ├── app/
│   │   ├── api/                   # API routes
│   │   │   ├── api_v1/            # Version 1 endpoints
│   │   │   │   ├── auth.py        # Registration, Login, Profile
│   │   │   │   ├── predict.py     # Predict Proxy (Image & WebSocket Stream)
│   │   │   │   ├── history.py     # Read/write user translation logs
│   │   │   │   └── router.py      # Combines v1 routes
│   │   │   └── deps.py            # API dependency injections (e.g. get_current_user)
│   │   ├── core/                  # Core helpers
│   │   │   ├── database.py        # SQLAlchemy engine and session setup
│   │   │   └── security.py        # Bcrypt password hashing & JWT tokens
│   │   ├── models/                # SQLAlchemy database models
│   │   │   ├── user.py            # User entity
│   │   │   └── history.py         # History entity (linked to users)
│   │   ├── schemas/               # Pydantic validation schemas
│   │   │   ├── user.py            # User sign-up & token validation
│   │   │   ├── history.py         # History database parsing
│   │   │   └── predict.py         # Proxy input mapping
│   │   ├── config.py              # Configuration manager & Environment loader
│   │   └── main.py                # FastAPI entry point
│   ├── .env.example               # Template environment configuration file
│   ├── requirements.txt           # Python packages for Gateway (FastAPI, JWT, SQLAlchemy)
│   └── README.md                  # Development setup and usage guide
│
└── model/                         # Machine Learning Model & Prediction Server (Port 8000)
    ├── model_endpoints/           # REST & WebSocket API wrapper for the ML models
    │   ├── app/
    │   │   ├── api_v1/            # Prediction routes (MediaPipe processing)
    │   │   │   ├── auth.py        # Simple API key authentication (uses MySQL)
    │   │   │   └── endpoints.py   # WebSocket handler (predict-stream) & Image predict
    │   │   ├── models/
    │   │   │   └── model_manager.py # Thread-safe dynamic model loader (.h5 models)
    │   │   └── main.py            # FastAPI entry point
    │   ├── Dockerfile
    │   └── requirements.txt       # Dependencies (FastAPI, TensorFlow, MediaPipe, OpenCV)
```

---

## 🗄️ Database Schemas (Mobile Backend)

The mobile backend uses **SQLAlchemy ORM** to manage the database structure. By default, it uses a local SQLite database (`signlens_mobile.db`) but can easily switch to a cloud database (like MySQL/PostgreSQL) via the `DATABASE_URL` environment variable.

### 1. User Model (`users` table)
Stores mobile user credentials and registration details.
* `id` (INT, Primary Key): Unique identifier.
* `email` (VARCHAR, Unique, Indexed): User email address.
* `hashed_password` (VARCHAR): Secure password hashed using Bcrypt.
* `full_name` (VARCHAR): User display name.
* `is_active` (BOOLEAN): Status toggle (default: `True`).
* `created_at` (DATETIME): Registration timestamp (default: `UTC now`).

### 2. History Model (`history` table)
Stores the translation log history.
* `id` (INT, Primary Key): Unique identifier.
* `user_id` (INT, Foreign Key): Reference to `users.id` (cascades on delete).
* `input_type` (VARCHAR): The type of translation input (`image`, `video`, `stream`).
* `prediction_label` (VARCHAR): The recognized sign language character/phrase (e.g. `'A'`, `'Hello'`).
* `confidence` (FLOAT): Model prediction confidence score (between `0.0` and `1.0`).
* `created_at` (DATETIME): Log timestamp (default: `UTC now`).

---

## 🔒 Security Benefits of This Architecture

* **Decoupled Servers**: The heavy machine learning backend is isolated inside the private network. Only the gateway backend is exposed to the public internet.
* **Token Authentication (JWT)**: Mobile clients do not need to authenticate with a username/password for every request. They receive a secure signed JWT token upon login, which they present in headers or query parameters (for WebSockets).
* **Private API Keys**: The gateway backend keeps a single, secure `MODEL_API_KEY` in its environment configuration. The mobile client never receives this key, preventing users from making unauthorized direct calls to the prediction server.
