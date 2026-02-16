import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// 1. Database Connection
connectDB();

// 2. 🔥 ULTIMATE CORS BYPASS (For Vercel & Render)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://simplify-ai-kappa.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token");
    
    // Preflight check
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

// Extra layer using standard package
app.use(cors({
    origin: "https://simplify-ai-kappa.vercel.app",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);

// Root Route
app.get("/", (req, res) => res.send("System Active and Ready for Handover! 🚀"));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server on port ${PORT}`);
});