import { v2 as cloudinary } from 'cloudinary';
import { createRequire } from 'module';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const require = createRequire(import.meta.url);
const multerStorageCloudinary = require('multer-storage-cloudinary');

// ✅ FIXED CONSTRUCTOR: CommonJS modules ko ESM mein handle karne ka foolproof tarika
const CloudinaryStorage = multerStorageCloudinary.CloudinaryStorage || multerStorageCloudinary;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // PDF filenames mein spaces remove karne ke liye logic
        const cleanName = file.originalname.replace(/\s+/g, '_').split('.')[0];
        return {
            folder: 'simplify_pdfs',
            resource_type: 'raw', // Mandatory for PDFs
            public_id: `${Date.now()}-${cleanName}`,
            format: 'pdf', 
        };
    },
});

export const uploadCloud = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export { cloudinary };