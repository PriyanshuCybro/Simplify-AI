import { v2 as cloudinary } from 'cloudinary';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const multerStorageCloudinary = require('multer-storage-cloudinary');
const multer = require('multer');

// Constructor fix
const CloudinaryStorage = multerStorageCloudinary.CloudinaryStorage || multerStorageCloudinary;

import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'simplify_pdfs',
        resource_type: 'raw', // Mandatory for PDFs
        format: 'pdf',
        public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`
    },
});

// 10MB limit and Error Catching for Multer
export const uploadCloud = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } 
});

export { cloudinary };