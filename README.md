  # VoiceCode.ai
  
  **The World's First Voice-Powered AI Coding Tutor**
  
  [![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-Bundler-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-Backend-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
  [![Gemini API](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)

</div>

---

## 🚀 Overview

**VoiceCode.ai** is a revolutionary e-learning platform that allows users to learn programming through natural voice conversations. Powered by **Google's Gemini 1.5 Multimodal API**, it provides a hands-free, interactive learning experience where an AI Tutor guides you, writes code for you, and explains concepts in real-time.

It's not just a course; it's a **Conversation with Code**.

## ✨ Key Features

### 🎙️ AI Voice Tutor
- **Real-time Voice Interaction**: Talk to your tutor naturally. No keyboard required.
- **Multimodal Context**: The AI sees what you see—editor code, console output, and navigation state.
- **Hands-Free Coding**: Ask the AI to "Write a for-loop" or "Debug this error," and watch it happen instantly.

### 🌌 "Nebula" Design System
- **Immersive UI**: A premium, dark-mode aesthetic with glassmorphic elements (`backdrop-blur`).
- **Orange & Purple Gradients**: Distinctive branding inspired by deep space nebulae.
- **Interactive Animations**: Smooth transitions, tilt effects on cards, and shiny beam buttons.

### 🎮 Gamified Learning
- **XP & Leveling System**: Earn XP for completing lessons and coding challenges.
- **Streaks**: Daily goals to keep you motivated.
- **Lesson Complete Celebration**: Satisfying animations and rewards when you level up.

### ⚡ Smart Automations (New!)
Integrated with **Make.com** for a seamless lifecycle experience:
1.  **🎓 Instant Certificates**: Get a PDF certificate emailed to you the moment you complete a course.
2.  **💤 Inactivity Motivator**: Receive a personalized AI-written nudge if you haven't coded in 7 days.
3.  **📊 Weekly Progress Report**: A "Spotify Wrapped" style email summary of your weekly XP and lessons.

---

## 🛠️ Tech Stack

- **Frontend**: React (TypeScript), Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (Context API)
- **AI/LLM**: Google Gemini Multimodal Live API
- **Backend/Auth**: Firebase (Auth, Firestore)
- **Editor**: Monaco Editor (VS Code for the web)
- **Automation**: Make.com (Webhooks, Gmail, Drive integration)

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn
- A Firebase Project
- A Google Gemini API Key

### Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/voicecode-ai.git
    cd voicecode-ai
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env.local` file in the root directory:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key
    VITE_FIREBASE_API_KEY=your_firebase_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 🤖 Automation Setup (Make.com)

We use **Make.com** to power our certificates and email notifications.

### 📂 Blueprints
Pre-built automation flows are included in the `make_blueprints/` directory:
- `certificate_blueprint.json`
- `inactivity_blueprint.json`
- `weekly_progress_blueprint.json`

### 📥 How to Import
1.  Create a FREE account on [Make.com](https://www.make.com).
2.  Create a **New Scenario**.
3.  Click `More (three dots) > Import Blueprint`.
4.  Select one of the JSON files from the `make_blueprints` folder.
5.  Connect your Google/Firebase accounts to the modules.

For a detailed guide, see [AUTOMATION_GUIDE.md](./AUTOMATION_GUIDE.md).

---

## 🗺️ Roadmap

- [x] **Phase 1: Foundation** (Core AI Voice, Editor, Basic Courses)
- [x] **Phase 2: Redesign** (Nebula Theme, Glassmorphism, Landing Page)
- [x] **Phase 3: Engagement** (Gamification, XP, Modal Rewards)
- [x] **Phase 4: Automation** (Certificates, Weekly Reports via Make.com)
- [ ] **Phase 5: Community** (Leaderboards, Peer Reviews)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<div align="center">
  <sub>Built with ❤️ by the VoiceCode Team using the Gemini API</sub>
</div>
