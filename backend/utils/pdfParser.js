import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParsePackage = require('pdf-parse'); 

// 🔥 Fix: 'pdf is not a function' bypass logic
// Ye line check karegi ki function direct hai ya .default ke andar
const pdf = typeof pdfParsePackage === 'function' ? pdfParsePackage : pdfParsePackage.default;

import axios from 'axios';

/**
 * Extracts raw text from a PDF file (Supports Buffer, URL, or Path)
 */
export const extractTextFromPDF = async (fileSource) => {
    try {
        let dataBuffer;

        // 1. Handle Buffer (Sabse fast, no network 401 error)
        if (Buffer.isBuffer(fileSource)) {
            console.log("📥 Processing PDF directly from memory buffer...");
            dataBuffer = fileSource;
        } 
        // 2. Handle Cloudinary URL
        else if (typeof fileSource === 'string' && fileSource.startsWith('http')) {
            console.log("🌐 Fetching PDF from URL...");
            const response = await axios.get(fileSource, { 
                responseType: 'arraybuffer',
                timeout: 30000 
            });
            dataBuffer = Buffer.from(response.data);
        } 
        // 3. Handle Local Path
        else if (typeof fileSource === 'string') {
            console.log("📁 Reading PDF from local path...");
            const fs = await import('fs');
            dataBuffer = fs.readFileSync(fileSource);
        } else {
            throw new Error("Invalid file source provided to PDF parser.");
        }

        // 🔥 Logic check before calling the function
        if (typeof pdf !== 'function') {
            throw new Error("pdf-parse library failed to load correctly as a function.");
        }

        // PDF extraction call
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