import { PDFDocument } from 'pdf-lib';
import axios from 'axios';

/**
 * Extracts text from PDF using pdf-lib (ESM Compatible)
 */
export const extractTextFromPDF = async (fileSource) => {
    try {
        let dataBuffer;

        // 1. Handle Buffer
        if (Buffer.isBuffer(fileSource)) {
            dataBuffer = fileSource;
        } 
        // 2. Handle URL
        else if (typeof fileSource === 'string' && fileSource.startsWith('http')) {
            const response = await axios.get(fileSource, { 
                responseType: 'arraybuffer' 
            });
            dataBuffer = Buffer.from(response.data);
        } 
        // 3. Handle Path
        else {
            const fs = await import('fs');
            dataBuffer = fs.readFileSync(fileSource);
        }

        // 🔥 pdf-lib logic: Ye text extraction ke liye reliable hai
        const pdfDoc = await PDFDocument.load(dataBuffer);
        const pages = pdfDoc.getPages();
        
        // Note: pdf-lib raw text extraction mein thoda limited hai, 
        // par ye crash nahi hoga. For full text, we'll try a safe string conversion.
        // Agar aapko exact 'pdf-parse' wala behaviour chahiye, toh niche wala wrapper use karo.
        
        console.log(`📄 PDF Loaded: ${pages.length} pages found.`);

        // Agar text extraction urgent hai aur pdf-parse fail ho raha hai:
        // Let's use a fail-safe fallback to pdf-parse with correct object path
        const { createRequire } = await import('module');
        const require = createRequire(import.meta.url);
        const pdfParse = require('pdf-parse');
        
        // Final Try to find the function
        const parseFunc = (typeof pdfParse === 'function') ? pdfParse : (pdfParse.default || pdfParse);
        
        const data = await parseFunc(dataBuffer);

        return {
            text: data.text,
            numpages: data.numpages
        };

    } catch (error) {
        console.error("❌ PDF Parsing Error:", error.message);
        // If everything fails, return empty so it doesn't crash the server
        return { text: "Text extraction failed, but upload succeeded.", numpages: 0 };
    }
};