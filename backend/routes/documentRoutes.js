import express from "express";
import {
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument,
    updateDocument,
    downloadDocument,
    askAI,
    generateFlashcards,
    getUserFlashcards,
    getDocFlashcards,
    deleteFlashcard,
    generateQuiz,
    saveQuizResult,
    getQuizDetails
} from '../controllers/documentController.js';

import protect from "../middleware/auth.js";
import { uploadCloud } from '../config/cloudinary.js';

const router = express.Router();

// 🔐 All routes are protected
router.use(protect);

// --- SPECIFIC ROUTES (Pehle likhne chahiye) ---
router.get('/flashcards', getUserFlashcards);
router.get('/quiz/:quizId', getQuizDetails);

// --- MAIN CRUD ---
router.post('/upload', uploadCloud.single('file'), uploadDocument);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.get('/:id/download', downloadDocument);
router.delete('/:id', deleteDocument);
router.put('/:id', updateDocument);

// --- AI & GENERATION ---
router.post('/:id/chat', askAI);
router.post('/:id/flashcards', generateFlashcards);
router.get('/:id/flashcards', getDocFlashcards);
router.delete('/flashcards/:id', deleteFlashcard); // Delete by Flashcard ID
router.post('/:id/quiz', generateQuiz);
router.post('/:id/quiz/:quizId/save', saveQuizResult);

export default router;