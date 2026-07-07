# SignLens: Frontend Documentation & Architecture Guide

## 1. Abstract

The **SignLens Frontend** is a modern, cross-platform mobile application built to bridge the communication gap between the Deaf community and non-signers. It provides real-time American Sign Language (ASL) translation, voice-to-sign capabilities, and an interactive learning module.

The app is built using **React Native**, powered by the **Expo** framework, and styled using **NativeWind** (Tailwind CSS for React Native) to achieve a highly polished, glassmorphism-inspired user interface.

---

## 2. Tech Stack & Dependencies

- **Core Framework**: React Native (0.81.5)
- **Toolchain & Routing**: Expo SDK 54 & Expo Router (File-based routing)
- **Styling**: NativeWind (Tailwind CSS 3.4)
- **Animations**: React Native Reanimated (v4) & React Native Gesture Handler
- **Media & Hardware Modules**:
  - `expo-camera`: High-performance video recording and device camera control.
  - `expo-video`: Modern video playback for translation results and learning modules.
  - `expo-speech`: Text-to-Speech (TTS) engine to vocalize translated ASL for non-signers.
  - `expo-blur`: Used extensively for frosted glass UI effects (Glassmorphism).

---

## 3. Directory Structure (File-Based Routing)

The frontend uses Expo Router, meaning the `app/` directory directly maps to the application's navigation state.

```text
frontend/
├── app/
│   ├── (auth)/                  # Authentication flow (Login, Signup, Reset)
│   ├── (tabs)/                  # Main bottom tab navigation
│   │   ├── home.tsx             # Dashboard
│   │   ├── camera.tsx           # ASL Video Capture interface
│   │   ├── learn.tsx            # ASL Dictionary & interactive lessons
│   │   └── settings.tsx         # User preferences
│   │
│   ├── translation-result.tsx   # Video playback & translation display
│   ├── text-to-sign.tsx         # Converts text into ASL avatars/videos
│   ├── voice-to-sign.tsx        # Converts spoken audio into ASL
│   └── profile.tsx              # User profile management
│
├── components/                  # Reusable UI elements (Buttons, Cards)
├── services/                    # API hooks and backend integration
└── assets/                      # Fonts, icons, and static images
```

---

## 4. Key Workflows & Screen Architecture

### 4.1 ASL Translation Flow (`camera.tsx` -> `translation-result.tsx`)

The core feature of the application is translating sign language in real-time.

1. **The Camera Interface (`camera.tsx`)**:

   - Features a custom-built camera UI with frosted glass controls (`BlurView`).
   - Supports Pinch-to-Zoom using `react-native-gesture-handler`.
   - Records video up to a maximum of 15 seconds.
   - Includes micro-interactions (e.g., the record button uses `react-native-reanimated` to pulse and change shape while recording).
2. **The Result Screen (`translation-result.tsx`)**:

   - Once the user stops recording, the video is passed to the translation screen.
   - The video loops in the background beneath a heavy dark blur layer, providing a cinematic aesthetic.
   - A glassmorphism bottom sheet slides up, displaying the translated text.
   - **Text-to-Speech**: Users can tap the speaker icon to vocalize the translated text using `expo-speech`, allowing a Deaf user to "speak" to a hearing person via the app.

### 4.2 The Learning Module (`learn.tsx`)

SignLens is not just a translation tool; it's an educational platform.

- Features categorized learning (`learn-category.tsx`) for alphabets, numbers, and common phrases.
- Includes step-by-step lessons (`learn-lesson.tsx`) and checkpoints (`learn-checkpoint.tsx`) to track user progress.

### 4.3 Bidirectional Communication

- **Text-to-Sign (`text-to-sign.tsx`)**: Allows hearing users to type text, which the app will translate back into ASL.
- **Voice-to-Sign (`voice-to-sign.tsx`)**: Integrates speech recognition to allow hearing users to speak into the app, which is then translated into ASL.

---

## 5. UI/UX Design Philosophy

The application strictly adheres to modern, premium design aesthetics:

1. **Dark Mode & Glassmorphism**: The app relies heavily on dark backgrounds (`bg-black` and `bg-slate-900`) contrasted with translucent, blurred overlays (`expo-blur`).
2. **Vibrant Accents**: The primary accent color is a high-visibility orange (`#FB5607`), used sparingly for primary actions (like recording or TTS playback) to draw the user's eye.
3. **Fluid Animations**: State changes (like entering a screen or hitting record) are governed by physical spring animations (`withSpring`) rather than linear fades, giving the app a tactile, responsive feel.

---

## 6. API Integration Strategy

The frontend is designed to communicate with the FastAPI backend (detailed in the Model Documentation).

- **Video Payloads**: Video blobs recorded via `expo-camera` are intended to be streamed or sent via multi-part form data to the backend's `/predict-stream` or `/predict` endpoints.
- **State Management**: API calls are modularized within the `services/` directory (e.g., `learnRepository.ts`) to maintain clean separation of concerns away from UI components.
