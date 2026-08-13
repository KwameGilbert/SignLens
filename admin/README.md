# 💻 SignLens Admin Web Dashboard Subsystem
## Vite React Administrative Management Panel Setup Guide

Welcome to the **SignLens Admin Web Dashboard Subsystem**. This web-based management portal is engineered for platform administrators, course managers, and system auditors. Built with **React**, **Vite**, **Tailwind CSS**, and **Lucide Icons**, it provides real-time monitoring of translation logs, platform analytics, user accounts, and Learning Management System (LMS) course content.

---

## 📁 1. Directory Structure Overview

```
SignLens/admin/
├── src/
│   ├── components/
│   │   ├── layout/         # Topbar, Sidebar, ProtectedRoute components
│   │   └── ui/             # Card, Table, Input, Button UI elements
│   ├── hooks/              # Custom React hooks (useDashboard, useUsers, useLessons, useTranslations)
│   ├── pages/              # Admin view pages
│   │   ├── dashboard/      # System statistics, charts & accuracy meters
│   │   ├── translations/   # Real-time translation activity log table
│   │   ├── users/          # User account management & roles
│   │   ├── lessons/        # Sign language course & lesson editor
│   │   ├── quizzes/        # Interactive quiz builder
│   │   └── Activity_logs/  # Audit trails & system activity logs
│   ├── services/           # Axios API client (api.js) & backend endpoints
│   └── App.jsx             # React router application root
├── index.html              # Web entry HTML
├── vite.config.js          # Vite build configuration
└── package.json            # Dependencies & scripts
```

---

## 🛠️ 2. Step-by-Step Installation & Local Setup

### Step 2.1: Prerequisites
Ensure **Node.js (v18.0.0 or higher)** is installed on your host computer.

---

### Step 2.2: Install Dependencies

Navigate to the `admin/` directory in Command Prompt / Terminal and run:

```bash
cd admin
npm install
```

---

## 🚀 3. Starting the Admin Dashboard Server

Start the Vite development server:

```bash
npm run dev
```

### Verification & Access:
1. Terminal will output: `Local: http://localhost:5173/`
2. Open your web browser (Google Chrome, Microsoft Edge, or Firefox) and navigate to: **`http://localhost:5173`**

---

## 📊 4. Admin Dashboard Features Walkthrough

1. **Dashboard Analytics (`pages/dashboard/Dashboard.jsx`):**
   - Live system metrics (Total Users, Total Translations Performed, Accuracy Rates).
   - Real-time Accuracy Meters (`AccuracyMeter.jsx`) and daily usage charts (`DashboardChart.jsx`).

2. **Translation History Logs (`pages/translations/TranslationLogs.jsx`):**
   - View every sign language translation performed across the mobile app, including timestamp, user ID, predicted text (e.g., `"THANK YOU"`), and model confidence score (e.g., `96.2%`).

3. **User Management (`pages/users/Users.jsx`):**
   - Manage user profiles, view registered accounts, and toggle administrative permissions.

4. **LMS Course Manager (`pages/lessons/Lessons.jsx` & `pages/quizzes/Quizzes.jsx`):**
   - Create, edit, and update sign language video lessons, course categories, quiz questions, and award badges.

5. **Activity Audit Logs (`pages/Activity_logs/ActivityLogs.jsx`):**
   - Inspect system security audit trails, login events, and operational events.

---

## ❓ 5. Common Admin Issues & Troubleshooting

### 🚨 Problem 1: `Port 5173 is in use`
* **Cause:** Another instance of Vite is running.
* **Solution:** Vite will automatically switch to port `5174`. Access the app at `http://localhost:5174`.

### 🚨 Problem 2: Dashboard displays "Failed to load statistics"
* **Cause:** The Node.js Backend Gateway (`Port 8001`) is not running.
* **Solution:** Start the backend server first by running `npm run dev` inside the `backend/` directory.
