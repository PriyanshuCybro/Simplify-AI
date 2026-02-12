import mongoose from "mongoose";


const quizSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // Fixed spelling from 'doumentId' to 'documentId'
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    // AI dwara generate kiye gaye original questions
    questions: [{
        question: {
            type: String,
            required: true,
        },
        options: {
            type: [String],
            required: true,
            validate: [array => array.length === 4, 'Must have exactly 4 options']
        },
        correctAnswer: {
            type: String,
            required: true,
        },
        explanation: {
            type: String,
            default: ""
        },
        difficulty : {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        }
    }],
    // User ne jo answers select kiye
    userAnswers: [{
        questionIndex: {
            type: Number,
            required: true,
        },
        selectedAnswer: {
            type: String,
            required: true,
        },
        isCorrect: {
            type: Boolean,
            required: true,
        },
        answeredAt : {
            type: Date,
            default: Date.now
        }
    }],
    score: {
        type: Number,
        default: 0
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    // New: Analytics ke liye percentage aur accuracy
    accuracy: {
        type: Number, // Percentage: (score/total) * 100
        default: 0
    },
    xpEarned: {
        type: Number, // Score * 10 logic ke liye
        default: 0
    },
    timeSpent: {
        type: Number, // Time in seconds
        default: 0
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'abandoned'],
        default: 'completed'
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries - Fixed to match documentId
quizSchema.index({ userId: 1, documentId: 1 });

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

export default Quiz;