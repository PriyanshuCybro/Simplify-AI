import pdf from 'pdf-parse/lib/pdf-parse.js'; // ✅ Direct file path for ESM
import axios from 'axios';

export const extractTextFromPDF = async (fileSource) => {
    try {
        let dataBuffer;

        if (fileSource.startsWith('http')) {
            const response = await axios.get(fileSource, { 
                responseType: 'arraybuffer',
                timeout: 30000 
            });
            dataBuffer = Buffer.from(response.data);
        } else {
            const fs = await import('fs');
            dataBuffer = fs.readFileSync(fileSource);
        }

        // pdf-parse ko call karne ka naya tarika
        const data = await pdf(dataBuffer);
        
        return {
            text: data.text,
            numpages: data.numpages
        };

    } catch (error) {
        console.error("❌ PDF Parsing Error:", error.message);
        throw new Error(error.message);
    }
};