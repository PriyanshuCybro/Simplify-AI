import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse'); 
import axios from 'axios';

/**
 * Extracts raw text from a PDF file (Supports Buffer, URL, or Path)
 */
export const extractTextFromPDF = async (fileSource) => {
    try {
        let dataBuffer;

        // 1. Agar input pehle se hi Buffer hai (Sabse Fast & No 401 Error)
        if (Buffer.isBuffer(fileSource)) {
            console.log("📥 Processing PDF directly from memory buffer...");
            dataBuffer = fileSource;
        } 
        // 2. Agar input Cloudinary URL hai
        else if (typeof fileSource === 'string' && fileSource.startsWith('http')) {
            console.log("🌐 Fetching PDF from URL...");
            const response = await axios.get(fileSource, { 
                responseType: 'arraybuffer',
                timeout: 30000 
            });
            dataBuffer = Buffer.from(response.data);
        } 
        // 3. Agar input local path hai
        else if (typeof fileSource === 'string') {
            console.log("📁 Reading PDF from local path...");
            const fs = await import('fs');
            dataBuffer = fs.readFileSync(fileSource);
        } else {
            throw new Error("Invalid file source provided to PDF parser.");
        }

        // Parse logic
        const data = await pdf(dataBuffer);

        if (!data.text || data.text.trim().length < 5) {
            throw new Error("PDF seems to be an image or contains no selectable text.");
        }

        return {
            text: data.text,
            numpages: data.numpages
        };

    } catch (error) {
        console.error("❌ PDF Parsing Error:", error.message);
        throw new Error(error.message);
    }
};