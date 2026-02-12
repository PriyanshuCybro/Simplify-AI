import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Custom hook use karenge
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import DocumentListPage from './pages/Documents/DocumentListPage';
import DocumentDetailPage from './pages/Documents/DocumentDetailPage';
import FlashcardPage from './pages/Flashcards/FlashcardPage';
import ProfilePage from './pages/Profile/ProfilePage';
// Ise copy karke purani 14 aur 15 number line se badal do
import QuizTakePage from "./pages/Qiuzzes/QuizTakePage";
import QuizResultPage from "./pages/Qiuzzes/QuizResultPage";
import QuizDetailsPage from "./pages/Qiuzzes/QuizDetailsPage";

import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const App = () => {
  const { user, loading } = useAuth(); // Real login state context se aa rahi hai

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Agar user logged in hai toh dashboard bhejo, warna login page */}
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
        
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        {/* 🛡️ Protected Routes (Sirf login ke baad dikhenge) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/flashcards" element={<FlashcardPage />} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/documents/:id/quiz/take" element={<QuizTakePage />} />
          <Route path="/documents/:id/quiz/result" element={<QuizResultPage />} />
          <Route path="/quiz/:quizId" element={<QuizDetailsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;