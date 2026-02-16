import { v2 as cloudinary } from 'cloudinary';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'simplify_pdfs',
        resource_type: 'raw', // 👈 Ye PDFs ke liye mandatory hai
        format: 'pdf',
        flags: "attachment", // 👈 Isse viewing issue fix hota hai
        public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`
    },
});

export const uploadCloud = multer({ storage });