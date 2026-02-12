import Quiz from '../models/Quiz.js';
import mongoose from 'mongoose';

// 1. Get All Flashcards for Library
export const getAllUserQuizzes = async (req, res) => {
    try {
        const userId = req.user._id;
        const quizzes = await Quiz.find({ userId })
            .populate('documentId', 'title fileUrl') 
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({ success: true, data: quizzes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Get Single Doc Flashcards
export const getFlashcardsByDoc = async (req, res) => {
    try {
        const { docId } = req.params;
        const quiz = await Quiz.findOne({ documentId: docId, userId: req.user._id })
            .populate('documentId', 'title');

        if (!quiz) {
            return res.status(404).json({ success: false, message: "AI cards not found!" });
        }
        res.status(200).json({ success: true, data: quiz });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 3. 🔥 DELETE FLASHCARD/QUIZ (Fixing the 404)
export const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await Quiz.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!quiz) {
            return res.status(404).json({ success: false, message: "Quiz node not found!" });
        }
        res.status(200).json({ success: true, message: "Neural Node Deleted Successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};