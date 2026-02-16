import { v2 as cloudinary } from 'cloudinary';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // ✅ Sahi tarika
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage Configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'simplify_pdfs',
            resource_type: 'raw', // PDF ke liye zaroori hai
            public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '_').split('.')[0]}`,
            format: 'pdf', 
        };
    },
});

// named export for routes
export const uploadCloud = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

export { cloudinary };