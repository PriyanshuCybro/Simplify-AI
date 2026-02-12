import { PDFExtract } from 'pdf.js-extract';
const pdfExtract = new PDFExtract();

/**
 * Extracts raw text from a PDF file
 */
export const extractTextFromPDF = async (filePath) => {
    try {
        const options = {}; 
        const data = await pdfExtract.extract(filePath, options);
        
        // Extract text and filter out empty strings or just whitespace
        const text = data.pages
            .map(page => {
                return page.content
                    .map(item => item.str)
                    .filter(str => str && str.trim().length > 0)
                    .join(' ');
            })
            .join('\n\n');

        // Check if we actually got any words
        if (!text || text.trim().length < 5) {
            throw new Error("The PDF seems to be an image or contains no selectable text.");
        }

        return {
            text: text,
            numpages: data.pages.length
        };
    } catch (error) {
        console.error("PDF Extract Utility Error:", error.message);
        throw new Error(error.message);
    }
};