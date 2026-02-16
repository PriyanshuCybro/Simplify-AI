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

// ES6 module __dirname alternative 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. Connect to MongoDB
connectDB();

// 2. Middlewares (Sahi Order mein)
app.use(cors({
    // Vercel link aur local link dono ko allow karo
    origin: ["https://simplify-ai-kappa.vercel.app", "http://localhost:5173"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for local uploads (Fallback)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes); 

// Health Check Route (Ye check karne ke liye ki server zinda hai ya nahi)
app.get("/", (req, res) => {
    res.send("Simplify AI Backend is running perfectly! 🚀");
});

// 4. 404 Handler (Routes ke baad par Error Handler se pehle)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found on this server",
        statuscode: 404
    });
});

// 5. Global Error Handler (Hamesha Sabse Last Mein)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

// '0.0.0.0' is mandatory for Render to detect the open port
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
    console.log(`Critical Error: ${err.message}`);
    // Server ko crash hone se bachaane ke liye optional: process.exit(1);
});