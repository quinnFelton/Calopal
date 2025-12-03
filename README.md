# Calopal — Release & Setup Guide

**Version**: 1.0.0  
**Last Updated**: December 2, 2025  

## Overview

Calopal is a React Native fitness tracking app built with **Expo**, **TypeScript**, **Drizzle ORM**, and **SQLite**. Track daily meals, set macro goals, and unlock cosmetics as you complete fitness milestones.

---
## Deliverables
https://docs.google.com/spreadsheets/d/1MJUmmVKrJdNKZ-HmoEoerkga3mLxRGds6eEHWYWUD_o/edit?gid=0#gid=0

## System Requirements

- **Node.js**: 18+ (LTS recommended)
- **npm**: 9+
- **Expo CLI**: 50+ (installed globally or via `npx`)
- **Device/Emulator**: 
  - Android emulator (via Android Studio) or physical device with Expo Go
  - iOS simulator (Mac only) or Expo Go on iPhone
  - Windows/Mac/Linux development machine

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/quinnFelton/Calopal.git
cd Calopal
```

### 2. Install Dependencies

```bash
npm install
```

If you encounter issues with optional dependencies (common on Windows):

```bash
rm -r node_modules package-lock.json
npm install
```

### 3. Verify Setup

```bash
npm run lint
```

This confirms TypeScript, ESLint, and project structure are healthy.

---

## Running the App

### Development Mode (Recommended)

```bash
npm start
```

This launches the **Expo Development Server**. You'll see a QR code in the terminal.

**On Android:**
- Scan the QR code with **Expo Go** app (available on Google Play)
- Or press `a` in the terminal to launch Android Emulator

**On iOS (Mac only):**
- Scan the QR code with iPhone camera
- Or press `i` to launch iOS Simulator

**Web (Limited):**
- Press `w` in the terminal to open in browser (some features unavailable)

### Production Build

```bash
npm run build
```

Creates optimized bundles for deployment to app stores (requires EAS CLI setup).

---

## Project Structure

```
Calopal/
├── app/                          # Main React Native app
│   ├── index.tsx                 # Root navigation & app initialization
│   ├── _layout.tsx               # Expo Router layout
│   ├── src/
│   │   ├── screens/              # UI screens (HomeScreen, GoalScreen, etc.)
│   │   ├── hooks/                # Custom hooks (useGoals, useMeals, useCosmetics, etc.)
│   │   ├── components/           # Reusable components
│   │   ├── db/                   # Drizzle schema & database setup
│   │   ├── context/              # Global context (GlobalContext)
│   │   └── style/                # Centralized styles (styles.tsx)
├── drizzle/                       # Database migrations
├── android/ & ios/               # Native platform code (Expo-generated)
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript config
├── eslint.config.js               # ESLint rules
├── babel.config.js                # Babel transpiler config
├── CODING_STYLE.md                # Development style guide
└── RELEASE.md                     # This file
```

---

## Key Features & How to Use

### 1. Onboarding

On first launch:
- **Enter your name** and **pet name**
- **Set daily macro goals** (calories, protein, fat, carbs)
- Choose **min/max** for each goal (↑ = at least, ↓ = at most)
- Tap **"Start My Journey"** to begin

### 2. Home Screen

**Daily view** showing:
- Pet cosmetics display
- Meal tracking
- Goal progress rings
- Quick-add meal button

### 3. Goal Screen

**Weekly report**:
- Checkmarks (✅) for completed days
- Daily macro breakdown with color coding
- Red = goal not met, Green = goal met

**Modify goals**:
- Tap **"Modify Goals"** button
- Update target values and min/max direction
- Changes apply immediately

### 4. Meal Tracking

**Add a meal**:
1. Tap **"Add Meal"** on Home
2. Enter meal name (e.g., "Breakfast")
3. Tap **"Create Meal"** (button enables after)
4. Tap **"Add Food"** to search & add food items
5. Tap **"Done"** when finished

Meals automatically update:
- Goal progress (macros added to daily total)
- Pet happiness (cosmetics unlocked at milestones)

### 5. Cosmetics Shop

**Unlock cosmetics** by completing goals:
- 1st cosmetic: 15 goals completed
- 2nd cosmetic: 30 goals completed
- 3rd cosmetic: 45 goals completed

Each card shows:
- Cosmetic name
- Green checkmark = visible on pet (toggle to show/hide)
- Preview image

**Debug mode** (test unlock tiers):
- Input field at bottom allows manual goal count adjustment
- Useful for testing before hitting actual milestones

---

## Database

### SQLite (Local Storage)

All data stored on-device via SQLite with **Drizzle ORM**:
- User details (name, pet, goals completed, onboarding state)
- Meals & meal components (name, date, macros)
- Goals (macro targets, progress, completion status)
- Cosmetics (visibility, position, appearance)

**Data persists** between app launches.

### Migrations

Database migrations stored in `drizzle/` directory. New schema changes auto-applied on app start (via Drizzle).

---

## Development Workflow

### Code Style

Follow the **Style Guide** For all coding Style 

### Debugging

**React Native Debugger:**
```bash
npm start
```
Press `j` in terminal to open Debugger

**Console Logs:**
Visible in terminal & Debugger console

**Hot Reload:**
- Changes auto-reload in dev mode
- Full refresh: `Ctrl+M` (Android) or `Cmd+D` (iOS Simulator)

### Testing the App

Run lint checks:
```bash
npm run lint
```

Common errors:
- **"Cannot find module"**: Delete `node_modules` and `package-lock.json`, then `npm install`
- **"Database locked"**: Restart the dev server
- **StyleSheet type errors**: Known React Native + TypeScript issue (non-blocking)

---

## Deployment

### Build for Android

```bash
eas build --platform android
```

### Build for iOS

```bash
eas build --platform ios
```

Requires:
- Apple Developer Account
- EAS CLI (`npm install -g eas-cli`)
- Provisioning profiles set up

Refer to [Expo EAS Documentation](https://docs.expo.dev/build/setup/) for details.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **App won't start** | Clear cache: `npm start -- --clear` |
| **Expo Go crashes** | Reinstall Expo Go from app store |
| **Database locked** | Restart dev server: `Ctrl+C` then `npm start` |
| **Styles not updating** | Full reload: `Cmd+D` (iOS) or `Ctrl+M` (Android) |
| **TypeScript errors on styles** | Known issue; non-blocking. Use `as any` if needed. |
| **Android emulator slow** | Allocate more RAM in Android Studio settings |

---

## Support & Contribution

**Bugs or feature requests?**
- Open an issue on [GitHub](https://github.com/quinnFelton/Calopal/issues)
- Include app version, device, and reproduction steps

**Want to contribute?**
- Fork the repo
- Create a feature branch
- Follow CODING_STYLE.md
- Submit a pull request

---

## License

Calopal © 2025 Quinn Felton. All rights reserved.

---

## What's Next?

- [ ] Connect to nutrition API for auto-food detection
- [ ] Social features (share progress, challenges)
- [ ] More cosmetics & pet customization
- [ ] Workout tracking integration
- [ ] Push notifications for goal reminders

---

**Happy tracking! 🐱**
