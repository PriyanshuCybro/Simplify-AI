import express from "express";
import {
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument,
    updateDocument,
    askAI,
    generateFlashcards, // Humne ise isi group mein add kar diya
    getUserFlashcards,
    getDocFlashcards,
    deleteFlashcard,
    generateQuiz,
    saveQuizResult,
    getQuizDetails
} from '../controllers/documentController.js';

import protect from "../middleware/auth.js";
import upload from '../config/multer.js';

const router = express.Router();

// Sabhi routes protected hain (Login zaroori hai)
router.use(protect);

// Upload route
router.post('/upload', upload.single('file'), uploadDocument);

// Basic CRUD routes
router.get('/', getDocuments);
// List all flashcard generations for user (placed before '/:id' to avoid route conflicts)
router.get('/flashcards', getUserFlashcards);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);
router.put('/:id', updateDocument);

// AI Related routes
router.post('/:id/chat', askAI); // Pehle se protected hai (router.use(protect))
router.post('/:id/flashcards', generateFlashcards);
// List flashcard generations for a specific document
router.get('/:id/flashcards', getDocFlashcards);
// Delete a single flashcard generation
router.delete('/flashcards/:id', deleteFlashcard);

// ✅ Aise hona chahiye
router.post('/:id/quiz', generateQuiz);

router.post('/:id/quiz/save', protect, saveQuizResult);
router.get('/quiz/:quizId', getQuizDetails);

export default router;