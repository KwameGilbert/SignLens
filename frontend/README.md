# 📱 SignLens Mobile Application Subsystem
## React Native (Expo SDK 54) Client Setup & User Guide

Welcome to the **SignLens Mobile Application Subsystem**. This is the cross-platform mobile client application built with **React Native (0.81.5)**, **Expo SDK 54**, **TypeScript**, **Expo Router**, **NativeWind (Tailwind CSS)**, and **Zustand**.

It provides real-time camera gesture recognition, text-to-speech vocalization, bidirectional voice/text-to-sign video playback, and a gamified Learning Management System (LMS).

---

## 📁 1. Directory Structure Overview

```
SignLens/frontend/
├── app/                        # Expo Router file-based screen routes
│   ├── (auth)/                 # Login, signup, forgot password, OTP screens
│   ├── (tabs)/                 # Main bottom tab bar navigation
│   │   ├── camera.tsx          # Real-time Sign Recognition Camera Scanner
│   │   ├── home.tsx            # Home Dashboard & Quick Action Launchers
│   │   ├── learn.tsx           # Gamified Sign Language Courses & Badges
│   │   └── settings.tsx       # User profile & application settings
│   ├── translation-result.tsx  # Glassmorphic prediction sheet & Text-to-Speech (TTS)
│   ├── text-to-sign.tsx        # Typed text to sign language video player
│   └── voice-to-sign.tsx       # Speech-to-text to sign video player
├── components/                 # Reusable UI components (GlassCard, FormInput, Header)
├── hooks/                      # Custom React Hooks (usePredict, useAuth, useHistory)
├── services/                   # API HTTP client (apiClient.ts) & endpoint definitions
├── stores/                     # Zustand state management (authStore.ts)
└── package.json                # Project dependencies & Expo scripts
```

---

## 🛠️ 2. Step-by-Step Installation & Local Setup

### Step 2.1: Prerequisites
- Ensure **Node.js (v18.0.0 or higher)** is installed on your computer.
- Download the free **Expo Go** app from the **Google Play Store** (Android) or **Apple App Store** (iOS) if testing on a physical smartphone.

---

### Step 2.2: Environment Configuration (`.env` File Setup)

Navigate to the `frontend/` directory in Command Prompt / Terminal:

```bash
cd frontend
```

Create a new file named `.env` in the `frontend/` directory with the following content:

```env
# Change IP Address below to match your PC's local network IP address
EXPO_PUBLIC_API_URL=http://192.168.1.100:8001/api/v1
EXPO_PUBLIC_WS_URL=ws://192.168.1.100:8001/api/v1
```

#### 💡 How to find your PC's local IP address:
- **On Windows:** Open Command Prompt, type `ipconfig`, and look for **IPv4 Address** (e.g., `192.168.1.100` or `10.0.0.15`).
- **On macOS / Linux:** Open Terminal, type `ifconfig` or `ip a`, and look for `inet` under your active Wi-Fi interface.

---

### Step 2.3: Install Dependencies

In your terminal (inside the `frontend/` folder), run:

```bash
npm install
```

---

## 🚀 3. Running the Mobile Application

Start the Expo Metro Bundler dev server:

```bash
npx expo start
```

Once executed, a **large QR Code** will appear in your terminal alongside a menu:

```
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web browser
› Press r │ reload app
```

### Options to Test the App:

#### 📲 Option A: On a Physical Smartphone (Recommended)
1. Ensure your smartphone and host computer are connected to the **same Wi-Fi network**.
2. Open **Expo Go** on Android (or native Camera app on iPhone) and scan the terminal QR Code.
3. The SignLens mobile app will load instantly on your phone!

#### 🌐 Option B: In Web Browser
1. In the terminal running `npx expo start`, press **`w`**.
2. Google Chrome will automatically launch `http://localhost:8081` with the app UI layout.

#### 🤖 Option C: On Android Studio Emulator
1. Launch your Android Emulator in Android Studio.
2. In the terminal running `npx expo start`, press **`a`**.

---

## 📱 4. Key Mobile App Features Walkthrough

1. **Camera Real-Time Scanner (`app/(tabs)/camera.tsx`):**
   - Tap the Camera icon on the bottom navigation bar.
   - Point the camera at a signer performing a sign.
   - The app captures gesture frames and streams them to the server.
   - A glassmorphic result modal slides up showing the prediction (e.g., `"THANK YOU"`) with confidence score.
   - Tap the **Speaker icon** to hear the translation spoken aloud via **Text-to-Speech (`expo-speech`)**.

2. **Text & Voice to Sign (`app/text-to-sign.tsx` & `app/voice-to-sign.tsx`):**
   - Type text (e.g., `"Hello"`) or speak into the microphone.
   - The app queries the backend and streams sequential sign language videos rendered via `expo-video`.

3. **Gamified Learning Hub (`app/(tabs)/learn.tsx`):**
   - Browse categories (Alphabets, Greetings, Numbers).
   - Complete interactive lessons, take flashcard quizzes, and earn achievement badges.

---

## ❓ 5. Common Mobile Issues & Troubleshooting

### 🚨 Problem 1: App displays "Network Error" when translating signs
* **Cause:** The mobile app is trying to connect to `localhost`, which refers to the phone itself rather than your PC server.
* **Solution:** 
  1. Find your PC's IP address (`ipconfig` on Windows).
  2. Update `frontend/.env` with your actual IP address (e.g., `EXPO_PUBLIC_API_URL=http://192.168.1.100:8001/api/v1`).
  3. Clear Expo cache and restart: `npx expo start -c`.

### 🚨 Problem 2: Camera permissions denied or black screen
* **Cause:** Camera permission was not granted on smartphone.
* **Solution:** Go to Phone Settings $\rightarrow$ Apps $\rightarrow$ Expo Go $\rightarrow$ Permissions $\rightarrow$ Enable Camera permission.

### 🚨 Problem 3: Metro Bundler fails to start (`Unable to resolve module`)
* **Cause:** Stale node_modules or Expo cache.
* **Solution:** Run `npx expo start -c` to reset the Metro bundler cache.
