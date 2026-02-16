import { v2 as cloudinary } from 'cloudinary';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const multerStorageCloudinary = require('multer-storage-cloudinary');
const multer = require('multer');

import dotenv from 'dotenv';
dotenv.config();

// Constructor extraction with ALL possible fallbacks for Node v22
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