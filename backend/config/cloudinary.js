import { v2 as cloudinary } from 'cloudinary';
import pkg from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Constructor extraction for Node v22 compatibility
const { CloudinaryStorage } = pkg;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'simplify_pdfs',
        resource_type: 'raw', // PDFs ke liye mandatory
        format: 'pdf',
        public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`
    },
});

export const uploadCloud = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export { cloudinary };