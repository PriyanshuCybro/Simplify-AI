import { v2 as cloudinary } from 'cloudinary';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Package ko load karne ka foolproof tareeka
const multerStorageCloudinary = require('multer-storage-cloudinary');
const multer = require('multer');

import dotenv from 'dotenv';
dotenv.config();

// Ye line sabse important hai: Ye constructor ko sahi jagah se nikaalegi
const CloudinaryStorage = multerStorageCloudinary.CloudinaryStorage || 
                          (multerStorageCloudinary.default ? multerStorageCloudinary.default.CloudinaryStorage : null) || 
                          multerStorageCloudinary.default || 
                          multerStorageCloudinary;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'simplify_pdfs',
        resource_type: 'raw', 
        format: 'pdf',
        public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`
    },
});

export const uploadCloud = multer({ storage });
export { cloudinary };