// import User from "../models/User.js";
// import Document from "../models/Document.js";
// import Quiz from "../models/Quiz.js";
// import Flashcard from "../models/FlashCard.js";

// // @desc    Get User Profile & Statistics (With Real Data Mapping)
// // @route   GET /api/users/stats
// // @access  Private
// export const getUserStats = async (req, res) => {
//     try {
//         const userId = req.user._id;

//         // 1. Database se user ka pura data fetch karo (Naye fields ke saath)
//         const [userDoc, docs, quizzes] = await Promise.all([
//             User.findById(userId).select("-password"), // 🔥 User model se saara data lo
//             Document.find({ userId }),
//             Quiz.find({ userId })
//                 .populate('documentId', 'title')
//                 .sort({ createdAt: -1 })
//         ]);

//         const totalDocs = docs.length;
//         const readyDocs = docs.filter(d => d.status === 'ready').length;
//         const totalFlashcards = readyDocs * 5; 
        
//         const successRate = totalDocs > 0 
//             ? Math.round((readyDocs / totalDocs) * 100) 
//             : 0;

//         const avgAccuracy = quizzes.length > 0 
//             ? Math.round(quizzes.reduce((acc, q) => acc + q.accuracy, 0) / quizzes.length) 
//             : 0;

//         res.status(200).json({
//             success: true,
//             data: {
//                 // ✅ Pehle yahan hardcoded tha, ab pura userDoc jayega
//                 user: userDoc, 
//                 metrics: {
//                     docsCount: totalDocs,
//                     flashcardsCount: totalFlashcards,
//                     successRate: successRate,
//                     avgAccuracy: avgAccuracy,
//                     totalQuizzes: quizzes.length
//                 },
//                 recentActivity: quizzes 
//             }
//         });
//     } catch (error) {
//         console.error("❌ STATS FETCH ERROR:", error.message);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // @desc    Get Current Logged-in User Data
// // @route   GET /api/users/me
// // @access  Private
// export const getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("-password");
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     return res.status(200).json({ success: true, data: user });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };


// // backend/controllers/userController.js mein is function ko update karo
// // ✅ Signature mein (req, res) hi kafi hai agar aap next use nahi kar rahe
// export const updateUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Data Update
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.age = req.body.age || user.age;
//     user.profession = req.body.profession || user.profession;
//     user.purpose = req.body.purpose || user.purpose;
//     user.gender = req.body.gender || user.gender;

//     const updatedUser = await user.save();

//     // 🔥 DHYAN DENA: Yahan next() call mat karna! 
//     // Seedha response bhej dena.
//     return res.status(200).json({
//       success: true,
//       message: "Neural Identity Updated!",
//       data: { user: updatedUser }
//     });

//   } catch (error) {
//     console.error("CRASH ERROR:", error.message);
//     return res.status(500).json({ success: false, error: error.message });
//   }
// };
// // @desc    Delete Quiz Result Manually
// // @route   DELETE /api/users/quiz/:id
// // @access  Private
// export const deleteQuizResult = async (req, res) => {
//     try {
//         const quizId = req.params.id;
        
//         // Check ownership (Security first!)
//         const quiz = await Quiz.findById(quizId);
//         if (!quiz) return res.status(404).json({ message: "Result not found" });

//         if (quiz.userId.toString() !== req.user._id.toString()) {
//             return res.status(401).json({ message: "Unauthorized delete attempt" });
//         }

//         await Quiz.findByIdAndDelete(quizId);
//         res.json({ success: true, message: "Intelligence record deleted successfully" });
//     } catch (error) { 
//         res.status(500).json({ success: false, message: error.message }); 
//     }
// };


import User from "../models/User.js";
import Document from "../models/Document.js";
import Quiz from "../models/Quiz.js";
import Flashcard from "../models/FlashCard.js";
// @desc    Get User Profile & Statistics
// userController.js mein getUserStats ko isse replace karein
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Parallel fetching
        const [userDoc, docs, quizzes, flashcards] = await Promise.all([
            User.findById(userId).select("-password"),
            Document.find({ userId }),
            Quiz.find({ userId }).populate('documentId', 'title').sort({ createdAt: -1 }),
            // ✅ Yahan Flashcard (vahi jo upar import kiya hai) use karein
            Flashcard.find({ userId }) 
        ]);

        if (!userDoc) return res.status(404).json({ success: false, message: "User not found" });

        const totalDocs = docs.length;
        const readyDocs = docs.filter(d => d.status === 'ready').length;
        
        // Count only actual flashcards from database
        const totalFlashcards = flashcards.length; 
        
        const successRate = totalDocs > 0 
            ? Math.round((readyDocs / totalDocs) * 100) 
            : 0;

        const avgAccuracy = quizzes.length > 0 
            ? Math.round(quizzes.reduce((acc, q) => acc + (Number(q.accuracy) || 0), 0) / quizzes.length) 
            : 0;

        res.status(200).json({
            success: true,
            data: {
                user: userDoc, 
                metrics: {
                    docsCount: totalDocs,
                    flashcardsCount: totalFlashcards,
                    successRate: successRate,
                    avgAccuracy: avgAccuracy,
                    totalQuizzes: quizzes.length
                },
                recentActivity: quizzes 
            }
        });
    } catch (error) {
        console.error("❌ BACKEND CRASH ERROR:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Get Current User
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update Profile
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Mapping fields from body
        const updatableFields = ['name', 'email', 'age', 'profession', 'purpose', 'gender'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) user[field] = req.body[field];
        });

        const updatedUser = await user.save();
        res.status(200).json({
            success: true,
            message: "Neural Identity Updated!",
            data: { user: updatedUser }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete Quiz Result
export const deleteQuizResult = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ success: false, message: "Result not found" });

        if (quiz.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        await Quiz.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Intelligence record deleted" });
    } catch (error) { 
        res.status(500).json({ success: false, message: error.message }); 
    }
};