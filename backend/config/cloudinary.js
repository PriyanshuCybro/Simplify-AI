import { v2 as cloudinary } from 'cloudinary';
import pkg from 'multer-storage-cloudinary'; // ✅ Logs wala fix: pura package import karo
const { CloudinaryStorage } = pkg;           // ✅ Phir usme se CloudinaryStorage nikalo
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage Config
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'simplify_pdfs',
            resource_type: 'raw', // Mandatory for PDFs
            public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '_').split('.')[0]}`,
            format: 'pdf', 
        };
    },
});

// Named export for routes
export const uploadCloud = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

export { cloudinary };