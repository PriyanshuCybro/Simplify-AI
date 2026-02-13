import pdf from 'pdf-parse';
import axios from 'axios';

/**
 * Extracts raw text from a PDF file (Supports both Local Path and Cloudinary URL)
 */
export const extractTextFromPDF = async (fileSource) => {
    try {
        let dataBuffer;

        // 🔥 CHECK: Agar fileSource ek URL hai (Cloudinary)
        if (fileSource.startsWith('http')) {
            console.log("🌐 Fetching PDF from Cloudinary URL for extraction...");
            
            // PDF ko URL se download karke buffer mein badalna
            const response = await axios.get(fileSource, { 
                responseType: 'arraybuffer',
                timeout: 30000 // 30 seconds timeout
            });
            
            dataBuffer = Buffer.from(response.data);
        } else {
            // 🏠 LOCAL: Agar aap abhi bhi local files use kar rahe ho
            console.log("📁 Reading PDF from local file system...");
            const fs = await import('fs');
            dataBuffer = fs.readFileSync(fileSource);
        }

        // 🔥 PDF Parsing logic
        const options = {
            // Aap yahan extra settings de sakte ho agar zaroorat ho
        };

        const data = await pdf(dataBuffer, options);

        // Check if we actually got any words
        if (!data.text || data.text.trim().length < 5) {
            throw new Error("The PDF seems to be an image or contains no selectable text.");
        }

        return {
            text: data.text,
            numpages: data.numpages
        };

    } catch (error) {
        console.error("❌ PDF Parsing Utility Error:", error.message);
        
        // Handle specific Axios errors
        if (error.response) {
            throw new Error(`Cloudinary download failed: ${error.response.statusText}`);
        }
        
        throw new Error(error.message);
    }
};