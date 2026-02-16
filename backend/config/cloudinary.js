import { v2 as cloudinary } from 'cloudinary';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// 🔥 Sabse safe tarika Constructor nikalne ka
const multerStorageCloudinary = require('multer-storage-cloudinary');
const CloudinaryStorage = multerStorageCloudinary.CloudinaryStorage || multerStorageCloudinary;

import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'simplify_pdfs',
            resource_type: 'raw',
            public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '_').split('.')[0]}`,
            format: 'pdf', 
        };
    },
});

export const uploadCloud = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } 
});

export { cloudinary };