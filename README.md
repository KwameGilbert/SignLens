# 🤟 SignLens: Real-Time Sign Language Translation & Gamified Learning Ecosystem
## Master System Installation & Execution Guide for Academic Evaluators & Supervisors

Welcome to the **SignLens** research project repository! This document serves as a comprehensive, step-by-step guide designed specifically for academic supervisors, external evaluators, and non-developer users to run the full SignLens ecosystem locally from scratch.

---

## 📐 1. System Architecture Overview

SignLens is a decoupled, multi-tier microservices platform. The system consists of **four primary modules** that run together on your local machine:

```
                                  ┌──────────────────────────────────────────────────────────┐
                                  │           4. ADMIN DASHBOARD (Vite React @ :5173)        │
                                  │    - System Analytics, User & Course Management, Logs   │
                                  └────────────────────────────┬─────────────────────────────┘
                                                               │ HTTP REST API
                                                               ▼
┌──────────────────────────────┐  REST & WebSockets  ┌──────────────────────────────────────┐
│  3. MOBILE APP (Expo RN)     ├────────────────────►│  2. BACKEND GATEWAY (Express @ :8001)  │
│  - Real-Time Camera Scanner  │                     │  - Auth (JWT/bcrypt), SQL Database   │
│  - Text/Voice to Sign Video  │                     │  - History Logging, LMS Content CRUD │
│  - Gamified Interactive LMS  │                     └──────────────────┬───────────────────┘
└──────────────────────────────┘                                        │ Private Loop + API Key
                                                                        ▼
                                                     ┌──────────────────────────────────────┐
                                                     │  1. ML SERVER (FastAPI @ :8000)      │
                                                     │  - MediaPipe Landmark Extractor      │
                                                     │  - TensorFlow Stacked LSTM (.h5)     │
                                                     └──────────────────────────────────────┘
```

---

## 🛠️ 2. Prerequisite Software Installation Guide (For Beginners)

Before starting the application, ensure the following **four software packages** are installed on your host computer:

### Step 2.1: Install Node.js (JavaScript Runtime)
1. Download **Node.js v18 LTS or v20 LTS** from the official website: [https://nodejs.org/](https://nodejs.org/)
2. Run the installer and click **Next** through all steps. Ensure **"Add to PATH"** is checked.
3. Verify installation by opening **Command Prompt (cmd)** and running:
   ```bash
   node -v
   npm -v
   ```

### Step 2.2: Install Python (Machine Learning Runtime)
1. Download **Python 3.10.x** from [https://www.python.org/downloads/](https://www.python.org/downloads/)
2. ⚠️ **CRITICAL STEP:** On the very first screen of the Python installer, check the box that says **"Add python.exe to PATH"**.
3. Complete the installation. Verify in Command Prompt:
   ```bash
   python --version
   pip --version
   ```

### Step 2.3: Install XAMPP (Local Database Server)
1. Download **XAMPP for Windows** (with Apache & MySQL) from [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Install XAMPP to the default location (`C:\xampp`).
3. Open the **XAMPP Control Panel**, click **Start** next to **Apache** and **MySQL**.

### Step 2.4: Install Expo Go App on Mobile Phone (Optional but Recommended)
- For testing on a physical smartphone: Download the free **Expo Go** application from the **Google Play Store** (Android) or **Apple App Store** (iOS).

---

## 🚀 3. Master Quick-Start Execution Sequence

To evaluate the complete system locally, follow this exact step-by-step order:

### ─────────────────────────────────────────────────────────────
### STEP 1: Set Up Local Database (XAMPP / MySQL)
### ─────────────────────────────────────────────────────────────
1. Open XAMPP Control Panel and start **Apache** and **MySQL**.
2. Open your web browser and go to: `http://localhost/phpmyadmin`
3. Click on **Databases** (top tab), enter database name `signlens_mobile`, and click **Create**.

---

### ─────────────────────────────────────────────────────────────
### STEP 2: Launch Machine Learning Inference Server (Port 8000)
### ─────────────────────────────────────────────────────────────
Open a new Command Prompt window and execute:
```bash
# 1. Navigate to ML model endpoints directory
cd model/model_endpoints

# 2. Create a virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# 4. Install ML dependencies
pip install -r requirements.txt

# 5. Start Python FastAPI Server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
✅ **Success Check:** Open `http://localhost:8000/docs` in your browser. You should see the interactive FastAPI Swagger interface.

---

### ─────────────────────────────────────────────────────────────
### STEP 3: Launch Node.js API Gateway Backend (Port 8001)
### ─────────────────────────────────────────────────────────────
Open a second Command Prompt window and execute:
```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file (if not present)
# Windows PowerShell command:
copy .env.example .env

# 4. Execute database migrations and seed default data
npm run migrate
npm run seed

# 5. Start Backend Gateway
npm run dev
```
✅ **Success Check:** Open `http://localhost:8001/api-docs` in your browser. You should see the Node.js API Swagger documentation.

---

### ─────────────────────────────────────────────────────────────
### STEP 4: Launch Admin Web Dashboard (Port 5173)
### ─────────────────────────────────────────────────────────────
Open a third Command Prompt window and execute:
```bash
# 1. Navigate to admin directory
cd admin

# 2. Install dependencies
npm install

# 3. Start Vite dev server
npm run dev
```
✅ **Success Check:** Open `http://localhost:5173` in your browser to view the Admin Dashboard.

---

### ─────────────────────────────────────────────────────────────
### STEP 5: Launch Mobile Client Application
### ─────────────────────────────────────────────────────────────
Open a fourth Command Prompt window and execute:
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start Expo development server
npx expo start
```
✅ **Testing Options:**
- **On Physical Phone:** Scan the displayed QR Code using your phone camera (iOS) or the **Expo Go** app (Android). (Ensure your phone and PC are connected to the same Wi-Fi network).
- **On Web Browser:** Press `w` in the terminal to launch the mobile layout in Google Chrome.
- **On Android Emulator:** Press `a` in the terminal (requires Android Studio installed).

---

## 📁 4. Component README Directory Map

For specialized, deep-dive instructions for each individual module, refer to the dedicated README files in their respective folders:

| Module Folder | Purpose | Link |
| :--- | :--- | :--- |
| **`model/`** | Machine Learning model training scripts, datasets, MediaPipe extraction & FastAPI server | [model/README.md](file:///c:/Users/JOSHUA%20ASEMANI/Music/SignLens/SignLens/model/README.md) |
| **`backend/`** | Node.js Express Gateway proxy, MySQL/PostgreSQL ORM schemas, JWT auth & REST endpoints | [backend/README.md](file:///c:/Users/JOSHUA%20ASEMANI/Music/SignLens/SignLens/backend/README.md) |
| **`frontend/`** | React Native (Expo SDK 54) mobile camera scanner, voice/text to sign & gamified LMS | [frontend/README.md](file:///c:/Users/JOSHUA%20ASEMANI/Music/SignLens/SignLens/frontend/README.md) |
| **`admin/`** | Vite React administrative management web dashboard for analytics & LMS course editing | [admin/README.md](file:///c:/Users/JOSHUA%20ASEMANI/Music/SignLens/SignLens/admin/README.md) |

---

## ❓ 5. Comprehensive Troubleshooting & Common Issues Guide

### 🚨 Problem 1: "Python is not recognized as an internal or external command"
* **Cause:** Python was installed without enabling "Add to PATH".
* **Solution:** Uninstall Python, re-run the Python 3.10 installer, and check **"Add python.exe to PATH"** on the first screen. Restart Command Prompt.

### 🚨 Problem 2: `ECONNREFUSED` or Database Error when starting Backend
* **Cause:** MySQL / XAMPP or PostgreSQL database server is not running, or database `signlens_mobile` was not created.
* **Solution:** 
  1. Open XAMPP Control Panel and ensure **MySQL** is started.
  2. Visit `http://localhost/phpmyadmin` and verify `signlens_mobile` database exists.
  3. Re-run `npm run migrate` in `backend/`.

### 🚨 Problem 3: Port Conflict Error (`EADDRINUSE: port 8000 or 8001 in use`)
* **Cause:** Another program or zombie node/python process is occupying the port.
* **Solution (Windows Command Prompt):**
  ```cmd
  # Find process ID on port 8000 or 8001
  netstat -ano | findstr :8000
  # Kill process by ID (replace <PID> with number found)
  taskkill /PID <PID> /F
  ```

### 🚨 Problem 4: Mobile App says "Network Error" when scanning signs
* **Cause:** The mobile app cannot reach your PC's local backend IP address.
* **Solution:**
  1. Find your PC's local IP address by running `ipconfig` in Command Prompt (e.g., `192.168.1.100`).
  2. Open `frontend/.env` and update:
     ```env
     EXPO_PUBLIC_API_URL=http://192.168.1.100:8001/api/v1
     EXPO_PUBLIC_WS_URL=ws://192.168.1.100:8001/api/v1
     ```
  3. Restart Expo: `npx expo start -c`

---

## 👥 6. Project Authors & Supervision

- **Gilbert Elikplim Kukah** (Index No: `5221040415`)
- **Anthony Afriyie** (Index No: `5221040495`)
- **Joshua Asemani** (Index No: `5221040452`)
- **Supervisor:** Dr. Joshua Dagadu
- **Institution:** Akenten Appiah-Menka University of Skills Training and Entrepreneurial Development (AAMUSTED), Kumasi, Ghana (July 2026).
