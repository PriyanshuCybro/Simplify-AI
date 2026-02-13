import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// 🔥 Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 🔥 Storage Configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'simplify_pdfs',
            resource_type: 'raw', // PDF, Docx etc ke liye 'raw' zaroori hai
            public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, '_').split('.')[0]}`,
            // Format specify karna optional hai par raw mein extension barkarar rakhta hai
            format: 'pdf', 
        };
    },
});

// 🔥 Filter: Sirf PDF allow karne ke liye (Security ke liye)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Bhai, sirf PDF file hi upload kar sakte ho!'), false);
    }
};

const uploadCloud = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export { cloudinary, uploadCloud };