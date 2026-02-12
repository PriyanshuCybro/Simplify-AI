// import express from 'express';
// import * as userController from '../controllers/userController.js';
// import { protect } from '../middleware/auth.js';
// // 🔥 Quiz controller se delete function import karein
// import { getFlashcardsByDoc, getAllUserQuizzes, deleteQuiz } from '../controllers/quizController.js';

// const router = express.Router();

// // --- Profile & Stats ---
// router.get('/stats', protect, userController.getUserStats);
// router.get('/me', protect, userController.getMe);
// router.put('/profile', protect, userController.updateUserProfile);

// // --- Flashcards / Quizzes Logic ---

// // Get all library cards
// router.get('/quizzes', protect, getAllUserQuizzes);

// // Get cards for a specific document
// router.get('/quizzes/:docId', protect, getFlashcardsByDoc);

// // 🔥 Delete specific quiz set (Ab ye 404 nahi dega)
// router.delete('/quizzes/:id', protect, deleteQuiz); 

// export default router;



// import express from 'express';
// import * as userController from '../controllers/userController.js';
// import { protect } from '../middleware/auth.js';
// // 🔥 Note: Agar delete logic userController mein hai, toh wahan se import karein
// import { getFlashcardsByDoc, getAllUserQuizzes } from '../controllers/quizController.js';

// const router = express.Router();

// // --- Profile & Stats ---
// // Frontend URL: /api/users/stats
// router.get('/stats', protect, userController.getUserStats);

// // Frontend URL: /api/users/me
// router.get('/me', protect, userController.getMe);

// // Frontend URL: /api/users/profile
// router.put('/profile', protect, userController.updateUserProfile);


// // --- Flashcards / Quizzes Logic ---

// // Get all library cards
// router.get('/quizzes', protect, getAllUserQuizzes);

// // Get cards for a specific document
// router.get('/quizzes/doc/:docId', protect, getFlashcardsByDoc);

// // 🔥 FIX: Delete function ka naam controller se match hona chahiye
// // Agar aapne userController mein 'deleteQuizResult' likha hai:
// router.delete('/quizzes/:id', protect, userController.deleteQuizResult); 





// export default router;


import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { getFlashcardsByDoc, getAllUserQuizzes } from '../controllers/quizController.js';

const router = express.Router();

// --- Profile & Stats ---
router.get('/stats', protect, userController.getUserStats);
router.get('/me', protect, userController.getMe);
router.put('/profile', protect, userController.updateUserProfile);

// --- Flashcards / Quizzes Logic ---
router.get('/quizzes', protect, getAllUserQuizzes);
router.get('/quizzes/doc/:docId', protect, getFlashcardsByDoc);

// 🔥 Delete specific quiz record
router.delete('/quizzes/:id', protect, userController.deleteQuizResult); 

export default router;