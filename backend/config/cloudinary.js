import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'simplify_pdfs',
        resource_type: 'raw', // PDF ke liye 'raw' hona bahut zaroori hai
        public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
    },
});

const uploadCloud = multer({ storage: storage });

export { cloudinary, uploadCloud };