import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import connectDB from "./config/db.js";
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

connectDB();

// 🔥 ULTIMATE CORS BYPASS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://simplify-ai-kappa.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});

// Standard middleware as secondary layer
app.use(cors({
    origin: "https://simplify-ai-kappa.vercel.app",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve React SPA build files
const distPath1 = path.join(__dirname, '../frontend/ai-learning-assistant/dist');
const distPath2 = path.join(__dirname, '../../frontend/ai-learning-assistant/dist');
const frontendPath = fs.existsSync(distPath1) ? distPath1 : fs.existsSync(distPath2) ? distPath2 : distPath1;

console.log('📁 Frontend Path:', frontendPath);
console.log('📁 Dist Exists:', fs.existsSync(frontendPath));

if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
}

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);

app.get("/", (req, res) => res.send("System Active 🚀"));

// SPA fallback - serve index.html for all non-API routes
app.use((req, res) => {
    const indexPath = path.join(frontendPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).json({ error: 'Frontend build not found', distPath: frontendPath });
    }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server on port ${PORT}`);
});