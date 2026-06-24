# SignLens Image Setup Guide

## Updated app.json Configuration

Your `app.json` has been updated with the following enhancements:

### Changes Made:
1. ✅ **App Name**: Updated from "frontend" to "SignLens"
2. ✅ **Slug**: Updated from "frontend" to "signlens"
3. ✅ **Scheme**: Updated from "frontend" to "signlens"
4. ✅ **Android Package**: Fixed from "com.signlense" to "com.signlens"
5. ✅ **iOS Bundle ID**: Added `com.signlens.app`
6. ✅ **Camera Permission**: Added `android.permission.CAMERA` to Android permissions
7. ✅ **Image Configurations**: Added icon, splash, favicon, and adaptive icon paths

---

## Required Images to Create

You need to create the following image files in the `assets/` directory:

### 1. **icon.png** (Main App Icon)
- **Location**: `assets/icon.png`
- **Size**: 1024x1024 pixels minimum
- **Format**: PNG with transparency
- **Purpose**: Used as app icon across all platforms
- **Design Tips**: 
  - Should work well at small sizes (24px-192px)
  - Avoid fine details that will be lost when scaled down
  - Consider adding rounded corners for iOS compatibility

### 2. **splash.png** (Splash Screen)
- **Location**: `assets/splash.png`
- **Size**: 1242x2436 pixels (covers both iOS and Android)
- **Format**: PNG
- **Purpose**: Shown while app loads
- **Design Tips**:
  - Background color: #ffffff (configured in app.json)
  - Center your logo/branding
  - Leave margins around edges
  - Recommend: Use welcome_bg.png as base and enhance it

### 3. **adaptive-icon.png** (Android Adaptive Icon)
- **Location**: `assets/adaptive-icon.png`
- **Size**: 108x108 pixels minimum (foreground, 72x72 safe zone)
- **Format**: PNG with transparency
- **Purpose**: Android Adaptive Icon foreground layer
- **Design Tips**:
  - Background color: #ffffff (configured in app.json)
  - Should be monochromatic or simple
  - Will be overlaid on dynamic Android backgrounds

### 4. **favicon.png** (Web Favicon)
- **Location**: `assets/favicon.png`
- **Size**: 192x192 pixels minimum (or use 512x512)
- **Format**: PNG
- **Purpose**: Browser tab icon for web version

---

## How to Create These Images

### Option 1: Using existing assets
You have `welcome_bg.png` which you could use as a base:
- Crop/resize for splash screen (1242x2436)
- Extract logo/icon element for app icon (1024x1024)

### Option 2: Create from scratch
Recommended tools:
- **Figma** (free): Professional design tool
- **Canva**: Simple, template-based
- **Adobe Express**: Beginner-friendly
- **GIMP** (free): Open-source image editor

### Option 3: Generate with AI
You could use tools like:
- Midjourney
- DALL-E
- Stable Diffusion

---

## Verification Checklist

After creating the images, verify:
- [ ] `assets/icon.png` exists (1024x1024)
- [ ] `assets/splash.png` exists (1242x2436)
- [ ] `assets/adaptive-icon.png` exists (108x108+)
- [ ] `assets/favicon.png` exists (192x192+)
- [ ] All files are PNG format
- [ ] app.json is properly formatted (✅ Already done)

---

## Testing

Once images are in place, test with:
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

---

## Current Asset Inventory

### Existing Images:
- ✅ `assets/images/welcome_bg.png` - Could be used for splash
- ✅ `assets/images/Scan.png` - Feature icon
- ✅ `assets/images/Learn.png` - Feature icon
- ✅ `assets/images/Voice.png` - Feature icon
- ✅ `assets/images/progress.png` - Utility image

### Existing Password Icons:
- ✅ `assets/icons/forgot-password.png`
- ✅ `assets/icons/reset_password.png`

---

## Next Steps

1. Create the four required images
2. Place them in the `assets/` directory
3. Run `npm run android/ios/web` to test
4. Verify icons display correctly on each platform

