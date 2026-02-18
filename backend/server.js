import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import userRoutes from './routes/userRoutes.js';

console.log('📦 Routes imported successfully:');
console.log('  ✓ authRoutes:', typeof authRoutes);
console.log('  ✓ documentRoutes:', typeof documentRoutes);
console.log('  ✓ userRoutes:', typeof userRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

connectDB();

// 🔥 CORS - Allow Vercel Frontend (MUST BE FIRST)
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
        'https://simplify-ai-kappa.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ];
    
    // Set CORS headers for all requests
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
    } else if (!origin) {
        res.header("Access-Control-Allow-Origin", "*");
    }
    
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    // Handle preflight
    if (req.method === "OPTIONS") {
        console.log(`✅ CORS Preflight: ${req.method} ${req.path}`);
        return res.status(200).end();
    }
    next();
});

// Standard middleware as secondary layer
app.use(cors({
    origin: [
        'https://simplify-ai-kappa.vercel.app',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📝 Request Logging Middleware
app.use((req, res, next) => {
    console.log(`📌 ${req.method} ${req.path}`);
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Mount API routes FIRST (before static files)
try {
    app.use('/api/auth', authRoutes);
    console.log("✅ Auth routes mounted");
} catch (err) {
    console.error("❌ Error mounting auth routes:", err);
}

try {
    app.use('/api/documents', documentRoutes);
    console.log("✅ Document routes mounted");
} catch (err) {
    console.error("❌ Error mounting document routes:", err);
}

try {
    app.use('/api/users', userRoutes);
    console.log("✅ User routes mounted");
} catch (err) {
    console.error("❌ Error mounting user routes:", err);
}

// ✅ Serve React SPA build files AFTER API routes
const frontendPath = path.join(__dirname, '../frontend/ai-learning-assistant/dist');
console.log('📁 Frontend path:', frontendPath);
console.log('📁 Frontend dist exists:', fs.existsSync(frontendPath));
app.use(express.static(frontendPath));

// ✅ TEST ENDPOINT - This should ALWAYS work
app.get("/api/test", (req, res) => {
    console.log("✅ TEST ENDPOINT HIT");
    res.json({ 
        message: "✅ Backend is working!", 
        timestamp: new Date().toISOString(),
        routes: ["/api/auth/login", "/api/auth/register", "/api/documents", "/api/users"]
    });
});

// ✅ SIMPLE LOGIN TEST - For testing without real DB
app.post("/api/auth/test-login", (req, res) => {
    const { email, password } = req.body;
    console.log("🔐 TEST LOGIN ATTEMPT:", email);
    
    if (email === "test@gmail.com" && password === "test123") {
        return res.json({
            success: true,
            user: {
                id: "123",
                email: email,
                username: "testuser"
            },
            token: "test-jwt-token"
        });
    }
    
    res.status(401).json({ 
        success: false,
        error: "Invalid test credentials"
    });
});

app.get("/", (req, res) => res.send("System Active 🚀"));

// SPA fallback - serve index.html for all non-API routes
app.use((req, res) => {
    console.log(`📄 SPA FALLBACK: Serving index.html for ${req.method} ${req.path}`);
    try {
        res.sendFile(path.join(frontendPath, 'index.html'));
    } catch (err) {
        console.error("❌ Error serving index.html:", err.message);
        res.status(500).json({ error: "Could not serve frontend" });
    }
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server on port ${PORT}`);
});