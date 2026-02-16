import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import errorHandler from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Connect to MongoDB
connectDB();

// 2. Middlewares
// ✅ CORS FIX: Origin array ko thoda clean kiya aur default settings add ki
app.use(cors({
    origin: ["https://simplify-ai-kappa.vercel.app", "http://localhost:5173", "http://localhost:3000"], 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes); 

// Health Check
app.get("/", (req, res) => {
    res.send("Simplify AI Backend is live and kicking! 🚀");
});

// 4. 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        statuscode: 404
    });
});

// 5. Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Critical Error: ${err.message}`);
});