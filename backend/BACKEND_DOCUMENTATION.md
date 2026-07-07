# SignLens: Backend Documentation & Feature Integration Guide

## 1. Abstract
The **SignLens Backend** acts as a robust, secure, and scalable API gateway that connects the React Native frontend application to the heavy-duty Machine Learning prediction servers. It is built using **FastAPI** (Python) and utilizes **SQLAlchemy** for database management. 

While the Machine Learning server (Port 8000) handles the mathematical complexity of MediaPipe and Neural Networks, this Gateway Backend (Port 8001) is responsible for authentication, user management, and securely relaying translation requests.

---

## 2. System Architecture

The backend utilizes a **Decoupled Proxy Architecture**:
1. **Public API Gateway (FastAPI)**: Exposed to the mobile app. Handles JWT Authentication and database interactions.
2. **Private ML Server (FastAPI)**: Completely isolated from the internet. The Gateway forwards sanitized, authenticated requests to the ML server using a secure, private API key.

---

## 3. Frontend Feature Mapping & API Integration

Because the backend is currently under development, this section outlines how the existing frontend features will integrate with the backend API endpoints.

### 3.1 Authentication & Profile Management
**Frontend Feature**: The `(auth)` flow (Login, Signup, Change Password) and the `profile.tsx` screen.
**Backend Implementation**:
- **Framework**: `bcrypt` for password hashing, JWT (JSON Web Tokens) for stateless authentication.
- **Endpoints**:
  - `POST /api/v1/auth/signup`: Creates a new user in the `users` table.
  - `POST /api/v1/auth/login`: Validates credentials and returns an `access_token`.
  - `GET /api/v1/auth/profile`: Validates the JWT and returns the user's information.
- **Database Schema (`users`)**:
  - `id` (INT, PK), `email` (VARCHAR, Unique), `hashed_password` (VARCHAR), `full_name` (VARCHAR).

### 3.2 Real-Time ASL Translation
**Frontend Feature**: The `camera.tsx` and `translation-result.tsx` interface, which records video/frames and expects an ASL translation text back.
**Backend Implementation**:
- **Proxy Endpoints**:
  - `POST /api/v1/predict`: For static image uploads. The backend authenticates the user, then forwards the image bytes and a private API key to the ML Server.
  - `WebSocket ws://.../predict-stream`: For real-time video translation. The frontend establishes a WebSocket connection with the JWT token in the query params. The backend validates the token, establishes a secondary WebSocket connection to the ML server, and streams the camera frames in real-time.
- **History Logging**: If a translation is successful (e.g., Confidence > 80%), the backend intercepts the prediction and saves it to the `history` table before forwarding it back to the mobile app.

### 3.3 Learning & Dictionary Modules
**Frontend Feature**: The `learn.tsx` and `learn-category.tsx` screens, which show ASL vocabulary and track user progress.
**Backend Implementation (Planned)**:
- **Endpoints**:
  - `GET /api/v1/learn/categories`: Returns a JSON structure of available lessons (Alphabets, Numbers, Phrases).
  - `POST /api/v1/learn/progress`: Updates the user's progress checkpoint in a newly planned `user_progress` database table.

### 3.4 Text-to-Sign & Voice-to-Sign
**Frontend Feature**: `text-to-sign.tsx` and `voice-to-sign.tsx` convert English text/audio into ASL representations.
**Backend Implementation (Planned)**:
- **Endpoints**:
  - `POST /api/v1/translate/text-to-sign`: The frontend sends an English string. The backend will parse the string and return a sequenced array of video URLs (e.g., MP4s of the individual signs) hosted on a cloud bucket (like AWS S3).
  - *Note*: Voice-to-Sign is currently handled client-side (via mobile native speech recognition) which converts the audio to text, before falling back to the Text-to-Sign API.

---

## 4. Security Philosophy

1. **Token Authentication**: Mobile clients never send raw passwords outside of the initial login. They use signed JWTs in the `Authorization: Bearer <token>` header.
2. **Private Network ML**: The TensorFlow models are highly resource-intensive. By hiding the ML server behind the Gateway, malicious actors cannot directly spam the ML server or bypass authentication. The Gateway strictly rate-limits and validates users before passing the data to the ML server.
3. **Dependency Injection**: FastAPI's `Depends(get_current_user)` is used on all protected routes, ensuring that a route will instantly reject a request with a 401 Unauthorized status if the JWT is invalid or expired.

---

## 5. Deployment Strategy
The backend is designed to be easily containerized and deployed:
- **Database**: Defaults to `SQLite` for local development, but uses SQLAlchemy to seamlessly migrate to `MySQL/PostgreSQL` in production.
- **Containerization**: A `Dockerfile` will wrap the FastAPI application and deploy it via cloud services (e.g., Render, AWS EC2, or DigitalOcean App Platform) using `uvicorn` as the ASGI web server.
