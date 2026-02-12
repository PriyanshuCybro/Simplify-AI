import Document from "../models/Document.js";
import FlashCard from "../models/FlashCard.js";
import Quiz from "../models/Quiz.js";
import { extractTextFromPDF } from '../utils/pdfParser.js';
import { chunkText } from '../utils/textChunker.js';
import fs from 'fs/promises';
import axios from 'axios';
import crypto from 'crypto';

// --- HELPERS ---
const validateDoc = (doc) => {
    if (!doc || !doc.extractedText || doc.extractedText.trim().length === 0) {
        return "Document text is empty or missing.";
    }
    return null;
};

// List all flashcard generations for the authenticated user
export const getUserFlashcards = async (req, res) => {
    try {
        const flashcards = await FlashCard.find({ userId: req.user._id })
            .populate('documentId', 'title')
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({ success: true, data: flashcards });
    } catch (error) {
        console.error("❌ GET USER FLASHCARDS ERROR:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// List flashcard generations for a specific document
export const getDocFlashcards = async (req, res) => {
    try {
        const { id } = req.params; // document id
        const flashcards = await FlashCard.find({ userId: req.user._id, documentId: id })
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({ success: true, data: flashcards });
    } catch (error) {
        console.error("❌ GET DOC FLASHCARDS ERROR:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a single flashcard generation by its id
export const deleteFlashcard = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await FlashCard.findOneAndDelete({ _id: id, userId: req.user._id });
        if (!deleted) return res.status(404).json({ success: false, message: "Flashcard not found" });
        res.status(200).json({ success: true, message: "Deleted" });
    } catch (error) {
        console.error("❌ DELETE FLASHCARD ERROR:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

const processPDF = async (documentId, filePath) => {
    try {
        const { text } = await extractTextFromPDF(filePath);
        const chunks = chunkText(text, 500, 50);
        await Document.findByIdAndUpdate(documentId, {
            extractedText: text,
            chunks: chunks.map((chunk, index) => ({
                content: typeof chunk === 'string' ? chunk : chunk.content,
                chunkIndex: index,
                pageNumber: 0 
            })),
            status: "ready", 
        });
        console.log(`✅ Document ${documentId} is READY`);
    } catch (error) {
        await Document.findByIdAndUpdate(documentId, { status: "failed" });
    }
};

// --- CRUD CONTROLLERS ---

// documentController.js ke andar uploadDocument function mein:

export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Cloudinary ka link ab req.file.path mein hai
        const fileUrl = req.file.path; 

        const newDoc = await Document.create({
            userId: req.user.id,
            title: req.body.title || req.file.originalname,
            fileName: req.file.originalname,
            filePath: fileUrl, // ✅ Ab yahan permanent Cloudinary URL save hoga
            filesize: req.file.size,
            status: "ready" // Direct ready kar sakte hain ya processing logic rakhein
        });

        res.status(201).json(newDoc);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getDocument = async (req, res) => {
    try {
        const document = await Document.findOne({ _id: req.params.id, userId: req.user._id });
        if (!document) return res.status(404).json({ success: false, message: "Not found" });
        res.status(200).json({ success: true, data: document });
    } catch (error) { 
        res.status(500).json({ success: false, message: error.message }); 
    }
};

export const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        if (document.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        await Document.findByIdAndDelete(id);
        await Quiz.deleteMany({ documentId: id });

        res.status(200).json({
            success: true,
            message: "Document deleted successfully"
        });

    } catch (error) {
        console.error("❌ DELETE DOC ERROR:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const updateDocument = async (req, res) => {
    try {
        const document = await Document.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id }, 
            { title: req.body.title }, 
            { new: true }
        );
        res.status(200).json({ success: true, data: document });
    } catch (error) { 
        res.status(500).json({ success: false, message: error.message }); 
    }
};

// --- CHAT LOGIC (GOOGLE GEMINI) ---
export const askAI = async (req, res) => {
    try {
        const { id } = req.params;
        const { question } = req.body;
        const document = await Document.findById(id);
        const apiKey = process.env.GEMINI_API_KEY;

        const errorMsg = validateDoc(document);
        if (errorMsg) return res.status(400).json({ success: false, message: errorMsg });

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const payload = {
            contents: [{
                parts: [{ text: `Text: ${document.extractedText.slice(0, 15000)}\n\nQuestion: ${question}` }]
            }]
        };

        const response = await axios.post(url, payload);
        if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            const answer = response.data.candidates[0].content.parts[0].text;
            return res.status(200).json({ success: true, answer });
        } else {
            throw new Error("Invalid response from AI");
        }
    } catch (error) {
        console.error("❌ CHAT ERROR:", error.message);
        res.status(error.response?.status || 500).json({ success: false, message: "AI Chat Error" });
    }
};
//flashcard generation
export const generateFlashcards = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findById(id);
        if (!document) return res.status(404).json({ success: false, message: "Doc not found" });

        const validationError = validateDoc(document);
        if (validationError) return res.status(400).json({ success: false, message: validationError });

        // 🔥 Dynamic Context: Randomly slicing the text
        const textLength = document.extractedText.length;
        const randomOffset = textLength > 3500 ? Math.floor(Math.random() * (textLength - 3500)) : 0;
        const textChunk = document.extractedText.slice(randomOffset, randomOffset + 3500);

        // 🔥 Variation token for backend use only
        const variation = crypto.randomBytes(4).toString('hex');

        const prompt = `
            DOCUMENT CONTENT: ${textChunk}
            
            TASK: Generate exactly 5 unique flashcards. 
            STRICT RULES:
            1. Return ONLY a valid JSON array: [{"question":"...","answer":"..."}].
            2. DO NOT include any IDs, tokens, or strings like "${variation}" in the output.
            3. Focus on different concepts than a typical summary.
        `;

        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            "model": "google/gemini-2.0-flash-001",
            "messages": [
                { "role": "system", "content": `You are a study assistant. Internal session ID: ${variation}. Never repeat this ID in responses.` },
                { "role": "user", "content": prompt }
            ],
            "temperature": 0.85
        }, {
            headers: { 
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            timeout: 60000
        });

        const rawText = response.data?.choices?.[0]?.message?.content || "";
        const jsonMatch = rawText.match(/\[.*\]/s);

        if (!jsonMatch) throw new Error("AI returned invalid JSON");
        const flashcards = JSON.parse(jsonMatch[0]);

        await FlashCard.create({ userId: req.user._id, documentId: id, cards: flashcards });
        res.status(200).json({ success: true, flashcards });
        
    } catch (error) {
        console.error("❌ FLASHCARD ERROR:", error.message);
        res.status(500).json({ success: false, message: "Sync Error" });
    }
};
// --- QUIZ LOGIC ---
export const generateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { count = 10 } = req.body;
        const quizCount = Math.max(5, Math.min(15, parseInt(count) || 10));

        const document = await Document.findById(id);
        if (!document) return res.status(404).json({ success: false, message: "Text not ready" });

        const textLength = document.extractedText.length;
        const randomOffset = textLength > 4500 ? Math.floor(Math.random() * (textLength - 4500)) : 0;
        const context = document.extractedText.slice(randomOffset, randomOffset + 4500);
        
        const variation = crypto.randomBytes(4).toString('hex');

        const prompt = `
            CONTEXT: ${context}
            TASK: Generate exactly ${quizCount} unique MCQs. 
            RULES: 
            - Return ONLY JSON: [{"question": "...", "options": ["a", "b", "c", "d"], "correctAnswer": "..."}]
            - NO internal IDs or session tokens in the text.
        `;

        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            "model": "google/gemini-2.0-flash-001",
            "messages": [
                { "role": "system", "content": `Random seed: ${variation}. Generate new variations of questions.` },
                { "role": "user", "content": prompt }
            ],
            "temperature": 0.8
        }, {
            headers: { "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}` },
            timeout: 60000
        });

        const rawText = response.data?.choices?.[0]?.message?.content || "";
        const jsonMatch = rawText.match(/\[.*\]/s);
        res.status(200).json({ success: true, data: JSON.parse(jsonMatch[0]) });

    } catch (error) {
        res.status(500).json({ success: false, message: "Quiz Error" });
    }
};
// @desc    Save Quiz Result
export const saveQuizResult = async (req, res) => {
    try {
        const { id } = req.params;
        const { score, totalQuestions, title, questions, userAnswers, timeSpent } = req.body;

        let quizTitle = title;
        if (!quizTitle) {
            const doc = await Document.findById(id);
            quizTitle = doc ? doc.title : "Untitled Quiz";
        }

        const quizResult = await Quiz.create({
            userId: req.user._id,
            documentId: id,
            title: quizTitle,
            score,
            totalQuestions,
            questions: questions || [],
            userAnswers: userAnswers || [],
            accuracy: (score / totalQuestions) * 100,
            xpEarned: score * 10,
            timeSpent: timeSpent || 0,
            status: 'completed'
        });

        res.status(201).json({ success: true, data: quizResult });
    } catch (error) {
        console.error("❌ SAVE QUIZ ERROR:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Quiz Details by ID
export const getQuizDetails = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findOne({ _id: quizId, userId: req.user._id })
            .populate('documentId', 'title');
        
        if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });
        
        res.status(200).json({ success: true, data: quiz });
    } catch (error) {
        console.error("❌ GET QUIZ DETAILS ERROR:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
