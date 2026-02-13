import { v2 as cloudinary } from 'cloudinary';
import pkg from 'multer-storage-cloudinary'; // ✅ Default import
const { CloudinaryStorage } = pkg;           // ✅ Extract from package
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

const uploadCloud = multer({ storage: storage });

export { cloudinary, uploadCloud };