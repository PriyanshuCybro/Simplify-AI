import pdf from 'pdf-parse';
import axios from 'axios';

/**
 * Extracts raw text from a PDF file (Supports Cloudinary URL)
 */
export const extractTextFromPDF = async (fileSource) => {
    try {
        let dataBuffer;

        if (fileSource.startsWith('http')) {
            console.log("🌐 Fetching PDF from Cloudinary URL...");
            const response = await axios.get(fileSource, { 
                responseType: 'arraybuffer',
                timeout: 30000 
            });
            dataBuffer = Buffer.from(response.data);
        } else {
            console.log("📁 Reading PDF from local path...");
            const fs = await import('fs');
            dataBuffer = fs.readFileSync(fileSource);
        }

        // ESM Compatibility Fix for pdf-parse
        const parsePDF = typeof pdf === 'function' ? pdf : pdf.default;
        
        const data = await parsePDF(dataBuffer);

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