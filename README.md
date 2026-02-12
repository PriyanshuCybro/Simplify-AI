# ⚡ SIMPLIFY: AI-Powered Learning Ecosystem

> **"Turning overwhelming PDFs into bite-sized intelligence."**

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)
![AI-Powered](https://img.shields.io/badge/AI-Google%20Gemini-orange.svg)
![Status](https://img.shields.io/badge/Status-Production--Ready-green.svg)

**Simplify** is a next-generation learning platform designed to bridge the gap between passive reading and active recall. By leveraging the power of **Google Gemini AI**, Simplify analyzes complex study materials and automatically generates interactive learning assets to help students master any subject faster.

---

## ✨ Core Features

### 🚀 Smart Document Ingestion
- **Automated AI Analysis:** Upload dense PDF documents and let our AI engine "distill" the core concepts.
- **Neural Status Tracking:** Real-time feedback as the AI processes your files—from "Ingesting" to "Intelligence Ready."

### 🧠 Active Recall Engine
- **Automated Flashcards:** Automatically generates high-impact flashcards for every document to boost memory retention.
- **Dynamic Quizzes:** Interactive assessments that test your understanding and provide instant feedback on your performance.

### 📊 Intelligence Dashboard
- **Real-Time Analytics:** Visualize your learning progress through live counters:
  - **Intelligence Base:** Total documents mastered.
  - **Neural Flashcards:** Total active study cards in your library.
  - **Analysis Success:** Successful AI conversions and accuracy rates.

### 🔐 Secure Infrastructure
- **JWT-Powered Security:** Industry-standard secure login and session management.
- **Personalized Neural Identity:** Profiles that adapt to your specific learning goals and profession.
- **Robust Recovery:** Advanced password recovery and email-based security flows.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, TailwindCSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **AI Engine** | Google Gemini API |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js |

---

## ⚙️ Quick Installation

### 1. Prerequisites
- Node.js installed
- MongoDB account (Atlas or Local)
- Google Gemini API Key

### 2. Backend Setup
```bash
cd backend
npm install

# Create a .env file in the backend/ folder:

Code snippet
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key
EMAIL_USER=your_gmail_id
EMAIL_PASS=your_gmail_app_password

Run the server: npm run dev


3. Frontend Setup
Bash
cd frontend
npm install
npm run dev

